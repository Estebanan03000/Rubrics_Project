import { api } from "../interceptors/authInterceptor";
import { GradeDetail } from "../models/GradeDetail";

class GradeDetailService {
  private readonly API_URL = "/grade-details";

  async getGradeDetails(): Promise<GradeDetail[]> {
    try {
      const response = await api.get<GradeDetail[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching grade details:", error);
      return [];
    }
  }

  async getDetailsByGradeId(gradeId: string): Promise<GradeDetail[]> {
    try {
      const details = await this.getGradeDetails();
      return details.filter((detail) => detail.grade_id === gradeId);
    } catch (error) {
      console.error("Error fetching grade details by grade:", error);
      return [];
    }
  }

  async createGradeDetail(
    detail: Omit<GradeDetail, "id">
  ): Promise<GradeDetail | null> {
    try {
      const response = await api.post<GradeDetail>(this.API_URL, detail);
      return response.data;
    } catch (error) {
      console.error("Error creating grade detail:", error);
      return null;
    }
  }

  async updateGradeDetail(
    id: string,
    detail: Partial<GradeDetail>
  ): Promise<GradeDetail | null> {
    try {
      const response = await api.put<GradeDetail>(
        `${this.API_URL}/${id}`,
        detail
      );

      return response.data;
    } catch (error) {
      console.error("Error updating grade detail:", error);
      return null;
    }
  }

  async deleteGradeDetail(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting grade detail:", error);
      return false;
    }
  }
}

export const gradeDetailService = new GradeDetailService();