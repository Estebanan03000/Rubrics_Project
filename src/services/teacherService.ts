import { api } from '../interceptors/authInterceptor';
import { Teacher } from '../models/Teacher';

class TeacherService {
  private readonly API_URL = '/api/academic/teachers';

  private getResponseData(response: any) {
    return response.data.data || response.data;
  }

  async getTeachers(): Promise<Teacher[]> {
    try {
      const response = await api.get(this.API_URL);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return [];
    }
  }

  async getTeacherById(id: string): Promise<Teacher | null> {
    try {
      const response = await api.get(`${this.API_URL}/${id}`);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Teacher not found:', error);
      return null;
    }
  }

  async createTeacher(teacher: Omit<Teacher, 'id'>): Promise<Teacher | null> {
    try {
      const response = await api.post(this.API_URL, teacher);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error creating teacher:', error);
      return null;
    }
  }

  async updateTeacher(
    id: string,
    teacher: Partial<Teacher>,
  ): Promise<Teacher | null> {
    try {
      const response = await api.put(`${this.API_URL}/${id}`, teacher);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error updating teacher:', error);
      return null;
    }
  }

  async deleteTeacher(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting teacher:', error);
      return false;
    }
  }
}

export const teacherService = new TeacherService();