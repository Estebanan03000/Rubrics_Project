import { api } from '../interceptors/authInterceptor';
import { User } from '../models/User';

class UserService {
    private readonly API_URL = '/users';

    async getUsers(): Promise<User[]> {
        try {
        const response = await api.get(this.API_URL);

        return response.data.data || response.data;
        } catch (error) {
        console.error(error);
        return [];
        }
    }

    async getUserById(id: string): Promise<User | null> {
        try {
            const response = await api.get(`${this.API_URL}/${id}`);

            return response.data.data || response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    async createUser(user: User): Promise<User | null> {
        try {
        const response = await api.post(this.API_URL, user);

        return response.data.data || response.data;
        } catch (error) {
        throw error;
        }
    }

    async updateUser(
        id: string,
        user: Partial<User>,
    ): Promise<User | null> {
        try {
        const response = await api.put(
            `${this.API_URL}/${id}`,
            user,
        );

        return response.data.data || response.data;
        } catch (error) {
        throw error;
        }
    }

    async deactivateUser(id: string): Promise<boolean> {
        try {
        await api.patch(
            `${this.API_URL}/${id}/deactivate`,
        );

        return true;
        } catch (error) {
        console.error(error);
        return false;
        }
    }
}

export const userService = new UserService();