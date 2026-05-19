/* Archivo: services/semesterService.ts
   Proposito: Servicio para consumir la API desde semesterService.
*/
import { api } from '../interceptors/authInterceptor';
import { Semester } from '../models/Semester';

class SemesterService {
  private readonly API_URL = '/api/academic/semesters';

  private getResponseData(response: any) {
    return response.data.data || response.data;
  }

  async getSemesters(): Promise<Semester[]> {
    try {
      const response = await api.get(this.API_URL);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error fetching semesters:', error);
      return [];
    }
  }

  async getSemesterById(id: string): Promise<Semester | null> {
    try {
      const response = await api.get(`${this.API_URL}/${id}`);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Semester not found:', error);
      return null;
    }
  }

  async createSemester(
    semester: Omit<Semester, 'id'>,
  ): Promise<Semester | null> {
    try {
      const response = await api.post(this.API_URL, semester);
      return this.getResponseData(response);
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
      const response = await api.put(`${this.API_URL}/${id}`, semester);
      return this.getResponseData(response);
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