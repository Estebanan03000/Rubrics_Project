/* Archivo: services/evaluationService.ts   Proposito: Servicio para consumir la API desde evaluationService.*/
import { api } from '../interceptors/authInterceptor';
import { Evaluation } from '../models/Evaluation';
class EvaluationService {
  private readonly API_URL = '/evaluations';
  async getEvaluations(): Promise<Evaluation[]> {
    try {
      const response = await api.get<Evaluation[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      return [];
    }
  }
  async getEvaluationById(id: string): Promise<Evaluation | null> {
    try {
      const response = await api.get<Evaluation>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Evaluation not found:', error);
      return null;
    }
  }
  async createEvaluation(
    evaluation: Omit<Evaluation, 'id'>,
  ): Promise<Evaluation | null> {
    try {
      const response = await api.post<Evaluation>(this.API_URL, evaluation);
      return response.data;
    } catch (error) {
      console.error('Error creating evaluation:', error);
      return null;
    }
  }
  async updateEvaluation(
    id: string,
    evaluation: Partial<Evaluation>,
  ): Promise<Evaluation | null> {
    try {
      const response = await api.put<Evaluation>(
        `${this.API_URL}/${id}`,
        evaluation,
      );
      return response.data;
    } catch (error) {
      console.error('Error updating evaluation:', error);
      return null;
    }
  }
  async deleteEvaluation(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      return false;
    }
  }
}
export const evaluationService = new EvaluationService();
