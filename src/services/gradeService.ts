/* Archivo: services/gradeService.ts   Proposito: Servicio para consumir la API desde gradeService.*/
import { api } from '../interceptors/authInterceptor';
import { Grade } from '../models/Grade';
class GradeService {
  private readonly API_URL = '/grades';
  async getGrades(): Promise<Grade[]> {
    try {
      const response = await api.get<Grade[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching grades:', error);
      return [];
    }
  }
  async getGradeById(id: string): Promise<Grade | null> {
    try {
      const response = await api.get<Grade>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Grade not found:', error);
      return null;
    }
  }
  async createGrade(grade: Omit<Grade, 'id'>): Promise<Grade | null> {
    try {
      const response = await api.post<Grade>(this.API_URL, grade);
      return response.data;
    } catch (error) {
      console.error('Error creating grade:', error);
      return null;
    }
  }
  async updateGrade(id: string, grade: Partial<Grade>): Promise<Grade | null> {
    try {
      const response = await api.put<Grade>(`${this.API_URL}/${id}`, grade);
      return response.data;
    } catch (error) {
      console.error('Error updating grade:', error);
      return null;
    }
  }
  async deleteGrade(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting grade:', error);
      return false;
    }
  }
}
export const gradeService = new GradeService();
