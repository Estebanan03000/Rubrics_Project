import { StudyPlan } from "../models/StudyPlan";
import { StudyPlanSubject } from "../models/StudyPlanSubject";
import { LinkStudyPlanSubjectPayload } from "../models/LinkStudyPlanSubjectPayload";
import { studyPlanService } from "../services/studyPlanService";

class StudyPlanBusiness {
  async createStudyPlan(studyPlan: StudyPlan): Promise<StudyPlan | null> {
    if (!studyPlan.career_id) {
      throw new Error("Debe seleccionar una carrera.");
    }

    if (!studyPlan.name.trim()) {
      throw new Error("El nombre del plan de estudios es obligatorio.");
    }

    if (!studyPlan.year || studyPlan.year <= 0) {
      throw new Error("Debe ingresar un año válido para el plan de estudios.");
    }

    return await studyPlanService.createStudyPlan({
      ...studyPlan,
      name: studyPlan.name.trim(),
      is_published: studyPlan.is_published ?? false,
      is_active: studyPlan.is_active ?? true,
    });
  }

  async updateStudyPlan(
    id: string,
    studyPlan: Partial<StudyPlan>
  ): Promise<StudyPlan | null> {
    if (studyPlan.name !== undefined && !studyPlan.name.trim()) {
      throw new Error("El nombre del plan de estudios es obligatorio.");
    }

    if (studyPlan.year !== undefined && studyPlan.year <= 0) {
      throw new Error("Debe ingresar un año válido.");
    }

    return await studyPlanService.updateStudyPlan(id, studyPlan);
  }

  async listSubjects(studyPlanId: string): Promise<StudyPlanSubject[]> {
    if (!studyPlanId) {
      throw new Error("Debe seleccionar un plan de estudios.");
    }

    return await studyPlanService.listStudyPlanSubjects(studyPlanId);
  }

  async linkSubject(
    studyPlanId: string,
    payload: LinkStudyPlanSubjectPayload
  ): Promise<StudyPlanSubject | null> {
    if (!studyPlanId) {
      throw new Error("Debe seleccionar un plan de estudios.");
    }

    if (!payload.subject_id) {
      throw new Error("Debe seleccionar una asignatura.");
    }

    if (
      payload.suggested_semester !== undefined &&
      payload.suggested_semester <= 0
    ) {
      throw new Error("El semestre sugerido debe ser mayor que cero.");
    }

    const linkedSubjects = await studyPlanService.listStudyPlanSubjects(
      studyPlanId
    );

    const alreadyLinked = linkedSubjects.some(
      (item) => item.subject_id === payload.subject_id
    );

    if (alreadyLinked) {
      throw new Error("La asignatura ya está vinculada a este plan de estudios.");
    }

    return await studyPlanService.linkSubjectToStudyPlan(studyPlanId, payload);
  }

  async unlinkSubject(
    studyPlanId: string,
    subjectId: string
  ): Promise<boolean> {
    if (!studyPlanId) {
      throw new Error("Debe seleccionar un plan de estudios.");
    }

    if (!subjectId) {
      throw new Error("Debe seleccionar una asignatura.");
    }

    return await studyPlanService.unlinkSubjectFromStudyPlan(
      studyPlanId,
      subjectId
    );
  }
}

export const studyPlanBusiness = new StudyPlanBusiness();