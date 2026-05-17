import { api } from '../interceptors/authInterceptor';
import { Subject } from '../models/Subject';

class SubjectService {
  private readonly API_URL = '/subjects';

  private getResponseData(response: any) {
    return response.data.data || response.data;
  }

  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await api.get(this.API_URL);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  }

  async getSubjectById(id: string): Promise<Subject | null> {
    try {
      const response = await api.get(`${this.API_URL}/${id}`);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Subject not found:', error);
      return null;
    }
  }

  async createSubject(subject: Subject): Promise<Subject | null> {
    try {
      const response = await api.post(this.API_URL, {
        ...subject,
        is_active: true,
      });

      return this.getResponseData(response);
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  }

  async updateSubject(
    id: string,
    subject: Partial<Subject>,
  ): Promise<Subject | null> {
    try {
      const response = await api.put(`${this.API_URL}/${id}`, subject);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  }

  async archiveSubject(id: string): Promise<Subject | null> {
    try {
      const response = await api.put(`${this.API_URL}/${id}`, {
        is_active: false,
      });

      return this.getResponseData(response);
    } catch (error) {
      console.error('Error archiving subject:', error);
      throw error;
    }
  }
}

export const subjectService = new SubjectService();