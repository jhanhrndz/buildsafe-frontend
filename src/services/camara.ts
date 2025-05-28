import { apiClient } from '../hooks/api';
import type {
  Camara,
  CamaraFilters,
  CamarasResponse,
  CreateCamaraPayload,
  UpdateCamaraPayload
} from '../types/entities';

export const CamaraService = {
  // Obtener todas las cámaras (coordinador)
  async getAll(): Promise<Camara[]> {
    return await apiClient.get('/camaras').then(r => r.data);
  },

  // Obtener cámaras activas (coordinador)
  async getActive(): Promise<Camara[]> {
    return await apiClient.get('/camaras/activas').then(r => r.data);
  },

  // Obtener cámaras por área (todas, coordinador)
  async getByArea(id_area: number): Promise<Camara[]> {
    return await apiClient.get(`/camaras/area/${id_area}/todas`).then(r => r.data);
  },

  // Obtener cámaras activas por área (coordinador y supervisor)
  async getActiveByArea(id_area: number): Promise<Camara[]> {
    return await apiClient.get(`/camaras/area/${id_area}/activas`).then(r => r.data);
  },

  // Obtener cámaras activas por supervisor (solo las de sus áreas)
  async getActiveBySupervisor(id_usuario: number): Promise<Camara[]> {
    return await apiClient.get(`/camaras/supervisor/${id_usuario}/activas`).then(r => r.data);
  },

  // Obtener cámara por ID
  async getById(id: number): Promise<Camara> {
    return await apiClient.get(`/camaras/${id}`).then(r => r.data);
  },

  // Crear cámara (coordinador)
  async create(data: CreateCamaraPayload): Promise<Camara> {
    return await apiClient.post('/camaras', data).then(r => r.data.camara);
  },

  // Actualizar cámara (coordinador)
  async update(data: UpdateCamaraPayload): Promise<Camara> {
    const { id_camara, ...updateData } = data;
    return await apiClient.put(`/camaras/${id_camara}`, updateData).then(r => r.data);
  },

  // Eliminar cámara (coordinador)
  async remove(id: number): Promise<void> {
    await apiClient.delete(`/camaras/${id}`);
  },

  // Actualizar última conexión (opcional)
  async updateConnection(id: number): Promise<void> {
    await apiClient.post(`/camaras/${id}/ping`);
  },

  // Obtener todas las cámaras de una obra
  async getByObra(id_obra: number): Promise<Camara[]> {
    return await apiClient.get(`/camaras/obra/${id_obra}`).then(r => r.data);
  }
};