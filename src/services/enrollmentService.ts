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

  async getEnrollmentsByGroup(groupId: string): Promise<Enrollment[]> {
    const enrollments = await this.getEnrollments();

    return enrollments.filter(
      (enrollment) =>
        enrollment.group_id === groupId &&
        enrollment.status === 'ACTIVE',
    );
  }

  async createEnrollments(
    payload: EnrollmentRequest,
  ): Promise<Enrollment[]> {
    try {
      const requests = payload.group_ids.map((groupId) =>
        api.post(this.API_URL, {
          student_id: payload.student_id,
          group_id: groupId,
          status: 'ACTIVE',
        }),
      );

      const responses = await Promise.all(requests);

      return responses.map((response) =>
        this.getResponseData(response),
      );
    } catch (error) {
      console.error('Error creating enrollments:', error);
      throw error;
    }
  }

  async cancelEnrollment(
    id: string,
  ): Promise<Enrollment | null> {
    try {
      const response = await api.put(`${this.API_URL}/${id}`, {
        status: 'CANCELLED',
      });

      return this.getResponseData(response);
    } catch (error) {
      console.error('Error cancelling enrollment:', error);
      throw error;
    }
  }
}

export const enrollmentService = new EnrollmentService();