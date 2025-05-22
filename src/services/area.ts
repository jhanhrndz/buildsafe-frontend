// src/services/area.ts
import { apiClient } from '../hooks/api';
import type { Area } from '../types/entities';

export const AreaService = {
  async getAll(): Promise<Area[]> {
    return await apiClient.get('/areas').then(res => res.data);
  },

  async getById(id: number): Promise<Area> {
    return await apiClient.get(`/areas/${id}`).then(res => res.data);
  },

  async getByObra(obraId: number): Promise<Area[]> {
    return await apiClient.get(`/areas/obra/${obraId}`).then(res => res.data);
  },

  async getAsignada(obraId: number, usuarioId: number): Promise<Area | null> {
    return await apiClient
      .get(`/areas/obra/${obraId}/supervisor/${usuarioId}`)
      .then(res => res.data);
  },

  async create(data: Omit<Area, 'id_area'>): Promise<Area> {
    return await apiClient.post('/areas', data).then(res => res.data);
  },

  async update(area: Area): Promise<void> {
    await apiClient.put(`/areas/${area.id_area}`, area);
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/areas/${id}`);
  },
};
