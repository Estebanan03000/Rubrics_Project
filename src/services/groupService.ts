import { api } from '../interceptors/authInterceptor';
import { Group } from '../models/Group';

class GroupService {
  private readonly API_URL = '/api/academic/groups';

  private getResponseData(response: any) {
    return response.data.data || response.data;
  }

  async getGroups(): Promise<Group[]> {
    try {
      const response = await api.get(this.API_URL);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  }

  async getGroupById(id: string): Promise<Group | null> {
    try {
      const response = await api.get(`${this.API_URL}/${id}`);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Group not found:', error);
      return null;
    }
  }

  async createGroup(group: Group): Promise<Group | null> {
    try {
      const response = await api.post(this.API_URL, group);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  }

  async updateGroup(
    id: string,
    group: Partial<Group>,
  ): Promise<Group | null> {
    try {
      const response = await api.put(`${this.API_URL}/${id}`, group);
      return this.getResponseData(response);
    } catch (error) {
      console.error('Error updating group:', error);
      return null;
    }
  }

  async assignTeacherToGroup(
    groupId: string,
    teacherId: string,
  ): Promise<Group | null> {
    try {
      const response = await api.patch(
        `${this.API_URL}/${groupId}/assign-teacher/${teacherId}`,
      );

      return this.getResponseData(response);
    } catch (error) {
      console.error('Error assigning teacher to group:', error);
      return null;
    }
  }

  async deleteGroup(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting group:', error);
      return false;
    }
  }
}

export const groupService = new GroupService();