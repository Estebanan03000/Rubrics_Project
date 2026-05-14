/* Archivo: services/studentService.ts   Proposito: Servicio para consumir la API desde studentService.*/
import { api } from '../interceptors/authInterceptor';
import { Student } from '../models/Student';
class StudentService {
  private readonly API_URL = '/students';
  async getStudents(): Promise<Student[]> {
    try {
      const response = await api.get<Student[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }
  async getStudentById(id: string): Promise<Student | null> {
    try {
      const response = await api.get<Student>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Student not found:', error);
      return null;
    }
  }
  async createStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
    try {
      const response = await api.post<Student>(this.API_URL, student);
      return response.data;
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
      const response = await api.put<Student>(`${this.API_URL}/${id}`, student);
      return response.data;
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
