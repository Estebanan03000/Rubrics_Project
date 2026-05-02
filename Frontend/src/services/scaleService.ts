/* Archivo: services/scaleService.ts   Proposito: Servicio para consumir la API desde scaleService.*/
import { api } from '../interceptors/authInterceptor';
import { Scale } from '../models/Scale';
class ScaleService {
  private readonly API_URL = '/scales';
  async getScales(): Promise<Scale[]> {
    try {
      const response = await api.get<Scale[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching scales:', error);
      return [];
    }
  }
  async getScaleById(id: string): Promise<Scale | null> {
    try {
      const response = await api.get<Scale>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Scale not found:', error);
      return null;
    }
  }
  async createScale(scale: Omit<Scale, 'id'>): Promise<Scale | null> {
    try {
      const response = await api.post<Scale>(this.API_URL, scale);
      return response.data;
    } catch (error) {
      console.error('Error creating scale:', error);
      return null;
    }
  }
  async updateScale(id: string, scale: Partial<Scale>): Promise<Scale | null> {
    try {
      const response = await api.put<Scale>(`${this.API_URL}/${id}`, scale);
      return response.data;
    } catch (error) {
      console.error('Error updating scale:', error);
      return null;
    }
  }
  async deleteScale(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting scale:', error);
      return false;
    }
  }
}
export const scaleService = new ScaleService();
