/* Archivo: services/rubricService.ts   Proposito: Servicio para consumir la API desde rubricService.*/
import { api } from '../interceptors/authInterceptor';
import { Rubric } from '../models/Rubric';
class RubricService {
  private readonly API_URL = '/rubrics';
  async getRubrics(): Promise<Rubric[]> {
    try {
      const response = await api.get<Rubric[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching rubrics:', error);
      return [];
    }
  }
  async getRubricById(id: string): Promise<Rubric | null> {
    try {
      const response = await api.get<Rubric>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Rubric not found:', error);
      return null;
    }
  }
  async createRubric(rubric: Omit<Rubric, 'id'>): Promise<Rubric | null> {
    try {
      const response = await api.post<Rubric>(this.API_URL, rubric);
      return response.data;
    } catch (error) {
      console.error('Error creating rubric:', error);
      return null;
    }
  }
  async updateRubric(
    id: string,
    rubric: Partial<Rubric>,
  ): Promise<Rubric | null> {
    try {
      const response = await api.put<Rubric>(`${this.API_URL}/${id}`, rubric);
      return response.data;
    } catch (error) {
      console.error('Error updating rubric:', error);
      return null;
    }
  }
  async deleteRubric(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting rubric:', error);
      return false;
    }
  }
}
export const rubricService = new RubricService();
