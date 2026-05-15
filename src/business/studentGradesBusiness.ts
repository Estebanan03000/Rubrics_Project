import { Criterion } from "../models/Criterion";
import { Evaluation } from "../models/Evaluation";
import { Grade } from "../models/Grade";
import { GradeDetail } from "../models/GradeDetail";
import { Scale } from "../models/Scale";

import { criterionService } from "../services/criterionService";
import { evaluationService } from "../services/evaluationService";
import { gradeDetailService } from "../services/gradeDetailService";
import { gradeService } from "../services/gradeService";
import { scaleService } from "../services/scaleService";

export interface StudentGradeRow {
  grade: Grade;
  evaluation?: Evaluation;
}

export interface StudentGradeDetailView {
  grade: Grade;
  evaluation?: Evaluation;
  details: GradeDetail[];
  criteria: Criterion[];
  scales: Scale[];
}

class StudentGradesBusiness {
  async getPublishedGradesByStudent(
    studentId: string
  ): Promise<StudentGradeRow[]> {
    const [grades, evaluations] = await Promise.all([
      gradeService.getGradesByStudent(studentId),
      evaluationService.getEvaluations(),
    ]);

    return grades
      .filter((grade) => grade.status === "submitted")
      .map((grade) => ({
        grade,
        evaluation: evaluations.find(
          (evaluation) => evaluation.id === grade.evaluation_id
        ),
      }));
  }

  async getGradeDetailView(gradeId: string): Promise<StudentGradeDetailView> {
    const grade = await gradeService.getGradeById(gradeId);

    if (!grade) {
      throw new Error("La calificación no existe.");
    }

    if (grade.status !== "submitted") {
      throw new Error("La calificación aún no ha sido enviada por el docente.");
    }

    const [evaluations, details, criteria, scales] = await Promise.all([
      evaluationService.getEvaluations(),
      gradeDetailService.getDetailsByGradeId(gradeId),
      criterionService.getCriteriaByRubricId(grade.rubric_id),
      scaleService.getScales(),
    ]);

    return {
      grade,
      evaluation: evaluations.find(
        (evaluation) => evaluation.id === grade.evaluation_id
      ),
      details,
      criteria,
      scales,
    };
  }

  async downloadReport(gradeId: string): Promise<void> {
    const blob = await gradeService.downloadGradeReport(gradeId);

    if (!blob) {
      throw new Error("No se pudo descargar el reporte.");
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `reporte-calificacion-${gradeId}.pdf`;
    link.click();

    window.URL.revokeObjectURL(url);
  }
}

export const studentGradesBusiness = new StudentGradesBusiness();