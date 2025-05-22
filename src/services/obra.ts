// services/obra.ts
import { apiClient } from '../hooks/api';
import type { Obra } from '../types/entities';

export const ObraService = {
  async getMisObras(userId: number): Promise<Obra[]> {
    return await apiClient.get(`/obras/mis-obras/${userId}`).then(r => r.data);
  },

  async getById(id: number): Promise<Obra> {
    return await apiClient.get(`/obras/${id}`).then(r => r.data);
  },

  async create(data: Omit<Obra, 'id_obra'>): Promise<void> {
    await apiClient.post('/obras', data);
  },

  async update(data: Obra): Promise<void> {
    await apiClient.put(`/obras/${data.id_obra}`, data);
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/obras/${id}`);
  },
};
