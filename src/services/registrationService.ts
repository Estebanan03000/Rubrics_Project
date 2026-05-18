import { api } from "../interceptors/authInterceptor";
import { Registration } from "../models/Registration";

type ApiResponse<T> = {
  data: T;
  message?: string;
};

class RegistrationService {
  private readonly API_URL = "/api/academic/registrations";

  async getRegistrations(): Promise<Registration[]> {
    try {
      const response = await api.get<ApiResponse<Registration[]>>(this.API_URL);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching registrations:", error);
      return [];
    }
  }

  async getRegistrationById(id: string): Promise<Registration | null> {
    try {
      const response = await api.get<ApiResponse<Registration>>(
        `${this.API_URL}/${id}`
      );

      return response.data.data;
    } catch (error) {
      console.error("Registration not found:", error);
      return null;
    }
  }

  async createRegistration(
    registration: Omit<Registration, "id">
  ): Promise<Registration | null> {
    try {
      const response = await api.post<ApiResponse<Registration>>(
        this.API_URL,
        registration
      );

      return response.data.data;
    } catch (error) {
      console.error("Error creating registration:", error);
      return null;
    }
  }

  async updateRegistration(
    id: string,
    registration: Partial<Registration>
  ): Promise<Registration | null> {
    try {
      const response = await api.put<ApiResponse<Registration>>(
        `${this.API_URL}/${id}`,
        registration
      );

      return response.data.data;
    } catch (error) {
      console.error("Error updating registration:", error);
      return null;
    }
  }

  async deleteRegistration(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting registration:", error);
      return false;
    }
  }
}

export const registrationService = new RegistrationService();