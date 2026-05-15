/* Archivo: services/enrollmentService.ts   Proposito: Servicio para consumir la API desde enrollmentService.*/
import { api } from '../interceptors/authInterceptor';
import { Enrollment } from '../models/Enrollment';
class EnrollmentService {
  private readonly API_URL = '/enrollments';
  async getEnrollments(): Promise<Enrollment[]> {
    try {
      const response = await api.get<Enrollment[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }
  }
  async getEnrollmentById(id: string): Promise<Enrollment | null> {
    try {
      const response = await api.get<Enrollment>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Enrollment not found:', error);
      return null;
    }
  }
  async createEnrollment(
    enrollment: Omit<Enrollment, 'id'>,
  ): Promise<Enrollment | null> {
    try {
      const response = await api.post<Enrollment>(this.API_URL, enrollment);
      return response.data;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      return null;
    }
  }
  async updateEnrollment(
    id: string,
    enrollment: Partial<Enrollment>,
  ): Promise<Enrollment | null> {
    try {
      const response = await api.put<Enrollment>(
        `${this.API_URL}/${id}`,
        enrollment,
      );
      return response.data;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      return null;
    }
  }
  async deleteEnrollment(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      return false;
    }
  }
}
export const enrollmentService = new EnrollmentService();
