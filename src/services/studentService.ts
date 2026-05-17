import { api } from '../interceptors/authInterceptor';
import { Student } from '../models/Student';

class StudentService {
  private readonly API_URL = '/academic/students';

  private getResponseData(response: any) {
    return response.data.data || response.data;
  }

  async getStudents(): Promise<Student[]> {
    try {
      const response = await api.get(this.API_URL);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }
}

export const studentService = new StudentService();