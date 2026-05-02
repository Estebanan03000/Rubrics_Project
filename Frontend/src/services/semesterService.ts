/* Archivo: services/semesterService.ts   Proposito: Servicio para consumir la API desde semesterService.*/
import { api } from '../interceptors/authInterceptor';
import { Semester } from '../models/Semester';
class SemesterService {
  private readonly API_URL = '/semesters';
  async getSemesters(): Promise<Semester[]> {
    try {
      const response = await api.get<Semester[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching semesters:', error);
      return [];
    }
  }
  async getSemesterById(id: string): Promise<Semester | null> {
    try {
      const response = await api.get<Semester>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Semester not found:', error);
      return null;
    }
  }
  async createSemester(
    semester: Omit<Semester, 'id'>,
  ): Promise<Semester | null> {
    try {
      const response = await api.post<Semester>(this.API_URL, semester);
      return response.data;
    } catch (error) {
      console.error('Error creating semester:', error);
      return null;
    }
  }
  async updateSemester(
    id: string,
    semester: Partial<Semester>,
  ): Promise<Semester | null> {
    try {
      const response = await api.put<Semester>(
        `${this.API_URL}/${id}`,
        semester,
      );
      return response.data;
    } catch (error) {
      console.error('Error updating semester:', error);
      return null;
    }
  }
  async deleteSemester(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting semester:', error);
      return false;
    }
  }
}
export const semesterService = new SemesterService();
