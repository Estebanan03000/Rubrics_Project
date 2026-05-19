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
    try {
      const response = await api.get(`${this.API_URL}/${id}`);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Student not found:', error);
      return null;
    }
  }

  async createStudent(student: Student): Promise<Student | null> {
    try {
      const response = await api.post(this.API_URL, student);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error creating student:', error);
      return null;
    }
  }

  async updateStudent(
    id: string,
    student: Partial<Student>,
  ): Promise<Student | null> {
    try {
      const response = await api.put(`${this.API_URL}/${id}`, student);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error updating student:', error);
      return null;
    }
  }

  async deleteStudent(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  }
}

export const studentService = new StudentService();