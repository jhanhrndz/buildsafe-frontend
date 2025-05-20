import { apiClient } from '../hooks/api';
import type { User } from '../types/entities';

export const UserService = {
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  },
};