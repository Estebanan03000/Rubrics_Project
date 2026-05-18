import { api } from '../interceptors/authInterceptor';
import { Rubric } from '../models/Rubric';

type ApiResponse<T> = {
  data: T;
  message?: string;
};

class RubricService {
  private readonly API_URL = '/api/evaluation/rubrics';

  async getPublicRubrics(): Promise<Rubric[]> {
    try {
      const response = await api.get<ApiResponse<Rubric[]>>(this.API_URL);
      return response.data.data.filter((rubric) => rubric.is_public === true);
    } catch (error) {
      console.error('Error fetching public rubrics:', error);
      return [];
    }
  }

  async getRubrics(): Promise<Rubric[]> {
    try {
      const response = await api.get<ApiResponse<Rubric[]>>(this.API_URL);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching rubrics:', error);
      return [];
    }
  }

  async getRubricById(id: string): Promise<Rubric | null> {
    try {
      const response = await api.get<ApiResponse<Rubric>>(`${this.API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Rubric not found:', error);
      return null;
    }
  }

  async createRubric(rubric: Omit<Rubric, 'id'>): Promise<Rubric | null> {
    try {
      const response = await api.post<ApiResponse<Rubric>>(this.API_URL, rubric);
      return response.data.data;
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
      const response = await api.put<ApiResponse<Rubric>>(
        `${this.API_URL}/${id}`,
        rubric,
      );
      return response.data.data;
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