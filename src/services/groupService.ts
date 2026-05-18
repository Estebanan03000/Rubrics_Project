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
}

export const groupService = new GroupService();