import { api } from "../interceptors/authInterceptor";
import { StudyPlan } from "../models/StudyPlan";
import { StudyPlanSubject } from "../models/StudyPlanSubject";
import { LinkStudyPlanSubjectPayload } from "../models/LinkStudyPlanSubjectPayload";

type ApiResponse<T> = {
  data: T;
  message?: string;
};

class StudyPlanService {
  private readonly API_URL = "/api/academic/study-plans";

  async getStudyPlans(): Promise<StudyPlan[]> {
    try {
      const response = await api.get<ApiResponse<StudyPlan[]>>(this.API_URL);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching study plans:", error);
      return [];
    }
  }

  async getStudyPlanById(id: string): Promise<StudyPlan | null> {
    try {
      const response = await api.get<ApiResponse<StudyPlan>>(`${this.API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Study plan not found:", error);
      return null;
    }
  }

  async createStudyPlan(studyPlan: Omit<StudyPlan, "id">): Promise<StudyPlan | null> {
    try {
      const response = await api.post<ApiResponse<StudyPlan>>(this.API_URL, studyPlan);
      return response.data.data;
    } catch (error) {
      console.error("Error creating study plan:", error);
      return null;
    }
  }

  async updateStudyPlan(id: string, studyPlan: Partial<StudyPlan>): Promise<StudyPlan | null> {
    try {
      const payload = {
        name: studyPlan.name,
        year: studyPlan.year,
        suggested_semester: studyPlan.suggested_semester,
        is_published: studyPlan.is_published,
        career_id: studyPlan.career_id,
      };

      const response = await api.put<ApiResponse<StudyPlan>>(`${this.API_URL}/${id}`, payload);
      return response.data.data;
    } catch (error) {
      console.error("Error updating study plan:", error);
      return null;
    }
  }

  async deleteStudyPlan(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting study plan:", error);
      return false;
    }
  }

  async listStudyPlanSubjects(studyPlanId: string): Promise<StudyPlanSubject[]> {
    try {
      const response = await api.get<ApiResponse<StudyPlanSubject[]>>(
        `${this.API_URL}/${studyPlanId}/subjects`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching study plan subjects:", error);
      return [];
    }
  }

  async linkSubjectToStudyPlan(
    studyPlanId: string,
    payload: LinkStudyPlanSubjectPayload
  ): Promise<StudyPlanSubject | null> {
    try {
      const response = await api.post<ApiResponse<StudyPlanSubject>>(
        `${this.API_URL}/${studyPlanId}/subjects/${payload.subject_id}`,
        {
          suggested_semester: payload.suggested_semester,
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Error linking subject to study plan:", error);
      return null;
    }
  }

  async unlinkSubjectFromStudyPlan(studyPlanId: string, subjectId: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${studyPlanId}/subjects/${subjectId}`);
      return true;
    } catch (error) {
      console.error("Error unlinking subject from study plan:", error);
      return false;
    }
  }
}

export const studyPlanService = new StudyPlanService();