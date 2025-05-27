// services/camara.service.ts
import { apiClient } from '../hooks/api';
import type { 
  Camara, 
  CamaraFilters, 
  CamarasResponse,
  CreateCamaraPayload,
  UpdateCamaraPayload
} from '../types/entities';

export const CamaraService = {
  // Obtener todas las cámaras
  async getAll(): Promise<Camara[]> {
    return await apiClient.get('/camaras').then(r => r.data);
  },

  // Obtener cámaras activas
  async getActive(): Promise<Camara[]> {
    return await apiClient.get('/camaras/activas').then(r => r.data);
  },

  // Obtener cámaras por área
  async getByArea(id_area: number): Promise<Camara[]> {
    return await apiClient.get(`/camaras/area/${id_area}`).then(r => r.data);
  },

  // Obtener cámaras activas por área
  async getActiveByArea(id_area: number): Promise<Camara[]> {
    return await apiClient.get(`/camaras/area/${id_area}/activas`).then(r => r.data);
  },

  // Obtener cámara por ID
  async getById(id: number): Promise<Camara> {
    return await apiClient.get(`/camaras/${id}`).then(r => r.data);
  },

  // CRUD
  async create(data: CreateCamaraPayload): Promise<Camara> {
    return await apiClient.post('/camaras', data).then(r => r.data);
  },

  async update(data: UpdateCamaraPayload): Promise<Camara> {
    const { id_camara, ...updateData } = data;
    return await apiClient.put(`/camaras/${id_camara}`, updateData).then(r => r.data);
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/camaras/${id}`);
  },

  // Actualizar estado de conexión
  async updateConnection(id: number): Promise<void> {
    await apiClient.post(`/camaras/${id}/ping`);
  }
};
