import { api } from '../interceptors/authInterceptor';
import { Student } from '../models/Student';

class StudentService {
  private readonly API_URL = '/api/academic/students';

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

  async getStudentById(id: string): Promise<Student | null> {
    const students = await this.getStudents();
    return students.find((student) => student.id === id) ?? null;
  }
}

export const studentService = new StudentService();