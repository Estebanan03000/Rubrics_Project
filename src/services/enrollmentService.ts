import { api } from '../interceptors/authInterceptor';
import {
  Enrollment,
  EnrollmentRequest,
} from '../models/Enrollment';

class EnrollmentService {
  private readonly API_URL = '/api/academic/enrollments';

  private getResponseData(response: any) {
    return response.data.data || response.data;
  }

  async getEnrollments(): Promise<Enrollment[]> {
    try {
      const response = await api.get(this.API_URL);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }
  }

  async createEnrollments(
    payload: EnrollmentRequest,
  ): Promise<Enrollment[]> {
    try {
      const response = await api.post(this.API_URL, payload);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error creating enrollments:', error);
      throw error;
    }
  }

  async cancelEnrollment(
    id: string,
  ): Promise<Enrollment | null> {
    try {
      const response = await api.patch(
        `${this.API_URL}/${id}/cancel`,
      );

      return this.getResponseData(response);
    } catch (error) {
      console.error('Error cancelling enrollment:', error);
      throw error;
    }
  }
}

export const enrollmentService = new EnrollmentService();