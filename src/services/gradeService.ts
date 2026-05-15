import { api } from "../interceptors/authInterceptor";
import { Grade } from "../models/Grade";

class GradeService {
  private readonly API_URL = "/grades";

  async getGrades(): Promise<Grade[]> {
    try {
      const response = await api.get<Grade[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching grades:", error);
      return [];
    }
  }

  async getGradeById(id: string): Promise<Grade | null> {
    try {
      const response = await api.get<Grade>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Grade not found:", error);
      return null;
    }
  }

  async getGradeByEnrollmentAndRubric(
    enrollmentId: string,
    rubricId: string
  ): Promise<Grade | null> {
    try {
      const grades = await this.getGrades();

      return (
        grades.find(
          (grade) =>
            grade.enrollment_id === enrollmentId &&
            grade.rubric_id === rubricId
        ) ?? null
      );
    } catch (error) {
      console.error("Error fetching grade by enrollment and rubric:", error);
      return null;
    }
  }

  async getGradesByStudent(studentId: string): Promise<Grade[]> {
    try {
      const grades = await this.getGrades();
      return grades.filter((grade) => grade.student_id === studentId);
    } catch (error) {
      console.error("Error fetching student grades:", error);
      return [];
    }
  }

  async createGrade(grade: Omit<Grade, "id">): Promise<Grade | null> {
    try {
      const response = await api.post<Grade>(this.API_URL, grade);
      return response.data;
    } catch (error) {
      console.error("Error creating grade:", error);
      return null;
    }
  }

  async updateGrade(
    id: string,
    grade: Partial<Grade>
  ): Promise<Grade | null> {
    try {
      const response = await api.put<Grade>(`${this.API_URL}/${id}`, grade);
      return response.data;
    } catch (error) {
      console.error("Error updating grade:", error);
      return null;
    }
  }

  async deleteGrade(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting grade:", error);
      return false;
    }
  }

  async downloadGradeReport(id: string): Promise<Blob | null> {
    try {
      const response = await api.get(`${this.API_URL}/${id}/report`, {
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      console.error("Error downloading grade report:", error);
      return null;
    }
  }
}

export const gradeService = new GradeService();