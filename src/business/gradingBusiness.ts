import { Criterion } from "../models/Criterion";
import { Enrollment } from "../models/Enrollment";
import { Evaluation } from "../models/Evaluation";
import { Grade } from "../models/Grade";
import { GradeFormData } from "../models/GradeFormData";
import { Scale } from "../models/Scale";
import { Student } from "../models/Student";

import { criterionService } from "../services/criterionService";
import { enrollmentService } from "../services/enrollmentService";
import { evaluationService } from "../services/evaluationService";
import { gradeDetailService } from "../services/gradeDetailService";
import { gradeService } from "../services/gradeService";
import { scaleService } from "../services/scaleService";
import { studentService } from "../services/studentService";

export interface EvaluationStudentRow {
  enrollment: Enrollment;
  student: Student;
  grade?: Grade | null;
}

export interface GradeContext {
  evaluation: Evaluation;
  enrollment: Enrollment;
  student: Student;
  criteria: Criterion[];
  scales: Scale[];
  existingGrade: Grade | null;
}

class GradingBusiness {
  private calculateCriterionScore(scaleValue: number, criterionWeight: number) {
    return (scaleValue * criterionWeight) / 100;
  }

  calculateFinalScore(data: GradeFormData): number {
    return data.criteria.reduce((total, item) => {
      return total + Number(item.score || 0);
    }, 0);
  }

  async getEvaluationStudents(
    evaluationId: string
  ): Promise<EvaluationStudentRow[]> {
    const evaluation = await evaluationService.getEvaluationById(evaluationId);

    if (!evaluation) {
      throw new Error("La evaluación seleccionada no existe.");
    }

    if (!evaluation.rubric_id) {
      throw new Error("La evaluación no tiene rúbrica asociada.");
    }

    const enrollments = await enrollmentService.getEnrollments();
    const students = await studentService.getStudents();
    const grades = await gradeService.getGrades();

    const activeEnrollments = enrollments.filter(
      (enrollment) =>
        enrollment.group_id === evaluation.group_id &&
        enrollment.status === "ACTIVE"
    );

    return activeEnrollments.map((enrollment) => {
      const student = students.find(
        (item) => item.id === enrollment.student_id
      );

      const grade = grades.find(
        (item) =>
          item.enrollment_id === enrollment.id &&
          item.evaluation_id === evaluationId
      );

      return {
        enrollment,
        student: student ?? {
          id: enrollment.student_id,
          user_id: "",
          first_name: "Estudiante",
          last_name: "sin datos",
          identification: "",
        },
        grade,
      };
    });
  }

  async getGradeContext(
    evaluationId: string,
    enrollmentId: string
  ): Promise<GradeContext> {
    const evaluation = await evaluationService.getEvaluationById(evaluationId);

    if (!evaluation) {
      throw new Error("La evaluación seleccionada no existe.");
    }

    if (!evaluation.rubric_id) {
      throw new Error("La evaluación no tiene rúbrica asociada.");
    }

    const enrollments = await enrollmentService.getEnrollments();
    const enrollment = enrollments.find((item) => item.id === enrollmentId);

    if (!enrollment) {
      throw new Error("La inscripción seleccionada no existe.");
    }

    const student = await studentService.getStudentById(enrollment.student_id);

    if (!student) {
      throw new Error("El estudiante seleccionado no existe.");
    }

    const criteria = await criterionService.getCriteriaByRubricId(
      evaluation.rubric_id
    );

    if (criteria.length === 0) {
      throw new Error("La rúbrica no tiene criterios registrados.");
    }

    const allScales = await scaleService.getScales();

    const scales = allScales.filter((scale) =>
      criteria.some((criterion) => criterion.id === scale.criterion_id)
    );

    const existingGrade = await gradeService.getGradeByEnrollmentAndRubric(
      enrollmentId,
      evaluation.rubric_id
    );

    return {
      evaluation,
      enrollment,
      student,
      criteria,
      scales,
      existingGrade,
    };
  }

  buildInitialFormData(context: GradeContext): GradeFormData {
    return {
      student_id: context.student.id ?? "",
      enrollment_id: context.enrollment.id ?? "",
      evaluation_id: context.evaluation.id ?? "",
      rubric_id: context.evaluation.rubric_id ?? "",
      observations: context.existingGrade?.observations ?? "",
      criteria: context.criteria.map((criterion) => ({
        criterion,
        scales: context.scales.filter(
          (scale) => scale.criterion_id === criterion.id
        ),
        selected_scale_id: "",
        score: 0,
        comment: "",
      })),
    };
  }

  updateCriterionSelection(
    data: GradeFormData,
    criterionId: string,
    scaleId: string
  ): GradeFormData {
    return {
      ...data,
      criteria: data.criteria.map((item) => {
        if (item.criterion.id !== criterionId) {
          return item;
        }

        const selectedScale = item.scales.find((scale) => scale.id === scaleId);

        const score = selectedScale
          ? this.calculateCriterionScore(
              selectedScale.value,
              item.criterion.weight
            )
          : 0;

        return {
          ...item,
          selected_scale_id: scaleId,
          score,
        };
      }),
    };
  }

  updateCriterionComment(
    data: GradeFormData,
    criterionId: string,
    comment: string
  ): GradeFormData {
    return {
      ...data,
      criteria: data.criteria.map((item) =>
        item.criterion.id === criterionId ? { ...item, comment } : item
      ),
    };
  }

  private validateBeforeSubmit(data: GradeFormData): void {
    const pending = data.criteria.filter((item) => !item.selected_scale_id);

    if (pending.length > 0) {
      throw new Error(
        "Debe seleccionar un nivel de escala para todos los criterios antes de enviar."
      );
    }
  }

  async saveGrade(data: GradeFormData, submit: boolean): Promise<Grade | null> {
    if (submit) {
      this.validateBeforeSubmit(data);
    }

    const finalScore = this.calculateFinalScore(data);

    const existingGrade = await gradeService.getGradeByEnrollmentAndRubric(
      data.enrollment_id,
      data.rubric_id
    );

    const payload: Omit<Grade, "id"> = {
      student_id: data.student_id,
      enrollment_id: data.enrollment_id,
      evaluation_id: data.evaluation_id,
      rubric_id: data.rubric_id,
      final_score: finalScore,
      observations: data.observations,
      status: submit ? "submitted" : "draft",
      is_locked: submit,
    };

    const grade = existingGrade?.id
      ? await gradeService.updateGrade(existingGrade.id, payload)
      : await gradeService.createGrade(payload);

    if (!grade?.id) {
      throw new Error("No se pudo guardar la calificación.");
    }

    const existingDetails = await gradeDetailService.getDetailsByGradeId(
      grade.id
    );

    for (const item of data.criteria) {
      if (!item.selected_scale_id) continue;

      const currentDetail = existingDetails.find(
        (detail) => detail.criterion_id === item.criterion.id
      );

      const detailPayload = {
        grade_id: grade.id,
        criterion_id: item.criterion.id ?? "",
        scale_id: item.selected_scale_id,
        score: item.score,
        comment: item.comment,
      };

      if (currentDetail?.id) {
        await gradeDetailService.updateGradeDetail(
          currentDetail.id,
          detailPayload
        );
      } else {
        await gradeDetailService.createGradeDetail(detailPayload);
      }
    }

    return grade;
  }
}

export const gradingBusiness = new GradingBusiness();