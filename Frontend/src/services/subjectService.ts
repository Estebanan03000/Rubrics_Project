/* Archivo: services/subjectService.ts   Proposito: Servicio para consumir la API desde subjectService.*/
import { api } from '../interceptors/authInterceptor';
import { Subject } from '../models/Subject';
class SubjectService {
  private readonly API_URL = '/subjects';
  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await api.get<Subject[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  }
  async getSubjectById(id: string): Promise<Subject | null> {
    try {
      const response = await api.get<Subject>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Subject not found:', error);
      return null;
    }
  }
  async createSubject(subject: Omit<Subject, 'id'>): Promise<Subject | null> {
    try {
      const response = await api.post<Subject>(this.API_URL, subject);
      return response.data;
    } catch (error) {
      console.error('Error creating subject:', error);
      return null;
    }
  }
  async updateSubject(
    id: string,
    subject: Partial<Subject>,
  ): Promise<Subject | null> {
    try {
      const response = await api.put<Subject>(`${this.API_URL}/${id}`, subject);
      return response.data;
    } catch (error) {
      console.error('Error updating subject:', error);
      return null;
    }
  }
  async deleteSubject(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting subject:', error);
      return false;
    }
  }
}
export const subjectService = new SubjectService();
