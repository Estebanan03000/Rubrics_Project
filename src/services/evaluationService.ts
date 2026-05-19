/* Archivo: services/evaluationService.ts   Proposito: Servicio para consumir la API desde evaluationService.*/
import { api } from '../interceptors/authInterceptor';
import { Evaluation } from '../models/Evaluation';
import { Rubric } from '../models/Rubric';

class EvaluationService {
  private readonly API_URL = '/api/evaluation/evaluations';

  private getResponseData(response: any) {
    return response.data.data || response.data;
  }

  async getEvaluationRubric(
    evaluationId: string,
  ): Promise<Rubric | null> {
    try {
      const response = await api.get(
        `${this.API_URL}/${evaluationId}/rubric`,
      );

      return this.getResponseData(response);
    } catch (error) {
      console.error('Error fetching evaluation rubric:', error);
      throw error;
    }
  }

  async associateRubric(
    evaluationId: string,
    rubricId: string,
    subjectId: string,
  ): Promise<Evaluation | null> {
    try {
      const response = await api.patch(
        `${this.API_URL}/${evaluationId}/associate-rubric/${rubricId}`,
        {
          subject_id: subjectId,
        },
      );

      return this.getResponseData(response);
    } catch (error) {
      console.error('Error associating rubric:', error);
      throw error;
    }
  }

  async getEvaluations(): Promise<Evaluation[]> {
    try {
      const response = await api.get(this.API_URL);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      return [];
    }
  }

  async getEvaluationsByGroup(groupId: string): Promise<Evaluation[]> {
    const evaluations = await this.getEvaluations();

    return evaluations.filter(
      (evaluation) => evaluation.group_id === groupId,
    );
  }

  async getEvaluationById(id: string): Promise<Evaluation | null> {
    try {
      const response = await api.get(`${this.API_URL}/${id}`);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Evaluation not found:', error);
      return null;
    }
  }
  
  async createEvaluation(
    evaluation: Omit<Evaluation, 'id'>,
  ): Promise<Evaluation | null> {
    try {
      const response = await api.post(this.API_URL, evaluation);
      return this.getResponseData(response);
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
      const response = await api.put(
        `${this.API_URL}/${id}`,
        evaluation,
      );
      return this.getResponseData(response);
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