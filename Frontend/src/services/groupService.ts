/* Archivo: services/groupService.ts   Proposito: Servicio para consumir la API desde groupService.*/
import { api } from '../interceptors/authInterceptor';
import { Group } from '../models/Group';
class GroupService {
  private readonly API_URL = '/groups';
  async getGroups(): Promise<Group[]> {
    try {
      const response = await api.get<Group[]>(this.API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  }
  async getGroupById(id: string): Promise<Group | null> {
    try {
      const response = await api.get<Group>(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Group not found:', error);
      return null;
    }
  }
  async createGroup(group: Omit<Group, 'id'>): Promise<Group | null> {
    try {
      const response = await api.post<Group>(this.API_URL, group);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  }
  async updateGroup(id: string, group: Partial<Group>): Promise<Group | null> {
    try {
      const response = await api.put<Group>(`${this.API_URL}/${id}`, group);
      return response.data;
    } catch (error) {
      console.error('Error updating group:', error);
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
