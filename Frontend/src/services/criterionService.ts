/* Archivo: services/criterionService.ts
   Proposito: Servicio para consumir la API desde criterionService.
*/
import { api } from '../interceptors/authInterceptor';
import { Criterion } from '../models/Criterion';

class CriterionService {
  private readonly API_URL = '/criteria';

  async getCriteria(): Promise<Criterion[]> {
    try {
      const response = await api.get<Criterion[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching criteria:', error);
      return [];
    }
  }

  async getCriterionById(id: string): Promise<Criterion | null> {
    try {
      const response = await api.get<Criterion>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Criterion not found:', error);
      return null;
    }
  }

  async createCriterion(
    criterion: Omit<Criterion, 'id'>,
  ): Promise<Criterion | null> {
    try {
      const response = await api.post<Criterion>(this.API_URL, criterion);
      return response.data;
    } catch (error) {
      console.error('Error creating criterion:', error);
      return null;
    }
  }

  async updateCriterion(
    id: string,
    criterion: Partial<Criterion>,
  ): Promise<Criterion | null> {
    try {
      const response = await api.put<Criterion>(
        `${this.API_URL}/${id}`,
        criterion,
      );
      return response.data;
    } catch (error) {
      console.error('Error updating criterion:', error);
      return null;
    }
  }

  async deleteCriterion(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting criterion:', error);
      return false;
    }
  }
}

export const criterionService = new CriterionService();
