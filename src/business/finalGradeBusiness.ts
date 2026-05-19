import { Enrollment } from '../models/Enrollment';
import {
  FinalGradeCell,
  FinalGradeConsolidated,
  FinalGradeStudentRow,
} from '../models/FinalGrade';
import { Grade } from '../models/Grade';
import { Student } from '../models/Student';

import { enrollmentService } from '../services/enrollmentService';
import { evaluationService } from '../services/evaluationService';
import { gradeService } from '../services/gradeService';
import { groupService } from '../services/groupService';
import { studentService } from '../services/studentService';
import { subjectService } from '../services/subjectService';
import { semesterService } from '../services/semesterService';

class FinalGradeBusiness {
  async getFinalGradeConsolidated(
    groupId: string,
  ): Promise<FinalGradeConsolidated> {
    const [group, evaluations, enrollments, grades, students] =
      await Promise.all([
        groupService.getGroupById(groupId),
        evaluationService.getEvaluationsByGroup(groupId),
        enrollmentService.getEnrollmentsByGroup(groupId),
        gradeService.getGrades(),
        studentService.getStudents(),
      ]);

    if (!group) {
      throw new Error('El grupo seleccionado no existe.');
    }

    const [subject, semester] = await Promise.all([
    group.subject_id
        ? subjectService.getSubjectById(group.subject_id)
        : Promise.resolve(null),
    group.semester_id
        ? semesterService.getSemesterById(group.semester_id)
        : Promise.resolve(null),
    ]);

    const rubricIds = evaluations
      .map((evaluation) => evaluation.rubric_id)
      .filter((rubricId): rubricId is string => Boolean(rubricId));

    const enrollmentIds = enrollments
      .map((enrollment) => enrollment.id)
      .filter((id): id is string => Boolean(id));

    const relatedGrades = grades.filter(
      (grade) =>
        rubricIds.includes(grade.rubric_id) &&
        enrollmentIds.includes(grade.enrollment_id),
    );

    const rows = enrollments.map((enrollment) =>
      this.buildStudentRow(enrollment, students, evaluations, relatedGrades),
    );

    const completeStudents = rows.filter(
      (row) => row.status === 'complete',
    ).length;

    const partialStudents = rows.filter(
      (row) => row.status === 'partial',
    ).length;

    const groupAverage =
      rows.length > 0
        ? rows.reduce((sum, row) => sum + row.finalScore, 0) / rows.length
        : 0;

    const highestScore =
      rows.length > 0 ? Math.max(...rows.map((row) => row.finalScore)) : 0;

    const lowestScore =
      rows.length > 0 ? Math.min(...rows.map((row) => row.finalScore)) : 0;

    const totalWeight = evaluations.reduce(
      (sum, evaluation) => sum + Number(evaluation.weight || 0),
      0,
    );

    return {
      groupInfo: {
        groupId: group.id ?? groupId,
        groupName: group.name ?? 'Grupo sin nombre',
        groupCode: group.group_code,
        subjectName: subject?.name ?? group.subject_id ?? 'Asignatura no disponible',
        subjectCode: subject?.code,
        semesterName:
        semester?.name ??
        semester?.code ??
        group.semester_id ??
        'Semestre no disponible',
        semesterIsActive: Boolean(semester?.is_active),
        teacherName: group.teacher_id ?? 'Docente no disponible',
      },
      evaluations: evaluations.map((evaluation) => ({
        id: evaluation.id ?? '',
        name: evaluation.name,
        weight: Number(evaluation.weight || 0),
        rubric_id: evaluation.rubric_id,
      })),
      students: rows,
      summary: {
        totalStudents: rows.length,
        completeStudents,
        partialStudents,
        groupAverage,
        highestScore,
        lowestScore,
        totalWeight,
      },
      rawEvaluations: evaluations,
    };
  }

  async confirmOfficialRegister(groupId: string): Promise<any[]> {
    return gradeService.registerFinalScoresByGroup(groupId);
  }

  private buildStudentRow(
    enrollment: Enrollment,
    students: Student[],
    evaluations: any[],
    grades: Grade[],
  ): FinalGradeStudentRow {
    const student = students.find(
      (studentItem) => studentItem.id === enrollment.student_id,
    );

    let finalScore = 0;
    let missingGrades = 0;

    const cells: FinalGradeCell[] = evaluations.map((evaluation) => {
      const grade = grades.find(
        (gradeItem) =>
          gradeItem.enrollment_id === enrollment.id &&
          gradeItem.rubric_id === evaluation.rubric_id,
      );

      const score = this.getGradeScore(grade);

      if (score === null) {
        missingGrades += 1;
      }

      const weightedScore =
        score !== null ? score * (Number(evaluation.weight) / 100) : 0;

      finalScore += weightedScore;

      return {
        evaluationId: evaluation.id ?? '',
        rubricId: evaluation.rubric_id,
        score,
        weightedScore,
        gradeId: grade?.id,
        isLocked: grade?.is_locked,
        status: grade?.status,
      };
    });

    return {
      enrollmentId: enrollment.id ?? '',
      enrollmentDate: enrollment.enrollment_date,
      studentId: student?.id,
      studentName: student
        ? `${student.first_name ?? ''} ${student.last_name ?? ''}`.trim()
        : 'Estudiante no encontrado',
      studentIdentification: student?.identification,
      grades: cells,
      finalScore,
      status: missingGrades > 0 ? 'partial' : 'complete',
      observations:
        missingGrades > 0 ? 'Faltan evaluaciones por calificar' : undefined,
    };
  }

  private getGradeScore(grade?: Grade): number | null {
    if (!grade) return null;

    if (Number(grade.final_score) > 0) {
      return Number(grade.final_score);
    }

    if (grade.details && grade.details.length > 0) {
      const total = grade.details.reduce(
        (sum, detail) => sum + Number(detail.score || 0),
        0,
      );

      return total / grade.details.length;
    }

    return grade.final_score !== undefined ? Number(grade.final_score) : null;
  }
}

export const finalGradeBusiness = new FinalGradeBusiness();