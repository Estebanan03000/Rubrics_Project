import { api } from '../interceptors/authInterceptor';
import { Career } from '../models/Career';

type ApiResponse<T> = {
  data: T;
  message?: string;
};

class CareerService {
  private readonly API_URL = '/academic/careers';

  async getCareers(): Promise<Career[]> {
    try {
      const response = await api.get<ApiResponse<Career[]>>(this.API_URL);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching careers:', error);
      return [];
    }
  }

  async getCareerById(id: string): Promise<Career | null> {
    try {
      const response = await api.get<ApiResponse<Career>>(`${this.API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Career not found:', error);
      return null;
    }
  }

  async createCareer(career: Omit<Career, 'id'>): Promise<Career | null> {
    try {
      const response = await api.post<ApiResponse<Career>>(this.API_URL, career);
      return response.data.data;
    } catch (error) {
      console.error('Error creating career:', error);
      return null;
    }
  }

  async updateCareer(
    id: string,
    career: Partial<Career>,
  ): Promise<Career | null> {
    try {
      const response = await api.put<ApiResponse<Career>>(
        `${this.API_URL}/${id}`,
        career,
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating career:', error);
      return null;
    }
  }

  async deleteCareer(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting career:', error);
      return false;
    }
  }
}

export const careerService = new CareerService();