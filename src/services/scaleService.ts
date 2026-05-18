import { api } from "../interceptors/authInterceptor";
import { Scale } from "../models/Scale";

type ApiResponse<T> = {
  data: T;
  message?: string;
};

class ScaleService {
  private readonly API_URL = "/api/evaluation/scales";

  async getScales(): Promise<Scale[]> {
    try {
      const response = await api.get<ApiResponse<Scale[]>>(this.API_URL);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching scales:", error);
      return [];
    }
  }

  async getScalesByCriterionId(criterionId: string): Promise<Scale[]> {
    const scales = await this.getScales();
    return scales.filter((scale) => scale.criterion_id === criterionId);
  }

  async getScaleById(id: string): Promise<Scale | null> {
    try {
      const response = await api.get<ApiResponse<Scale>>(
        `${this.API_URL}/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Scale not found:", error);
      return null;
    }
  }

  async createScale(scale: Omit<Scale, "id">): Promise<Scale | null> {
    try {
      const response = await api.post<ApiResponse<Scale>>(this.API_URL, scale);
      return response.data.data;
    } catch (error) {
      console.error("Error creating scale:", error);
      return null;
    }
  }

  async updateScale(id: string, scale: Partial<Scale>): Promise<Scale | null> {
    try {
      const response = await api.put<ApiResponse<Scale>>(
        `${this.API_URL}/${id}`,
        scale
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating scale:", error);
      return null;
    }
  }

  async deleteScale(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting scale:", error);
      return false;
    }
  }
}

export const scaleService = new ScaleService();