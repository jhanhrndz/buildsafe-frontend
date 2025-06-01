import { apiClient } from '../hooks/api';
import type { ReporteResumen, ReporteDetail, CategoriaEpp } from '../types/entities';

export const ReporteService = {
  async getAll(): Promise<ReporteResumen[]> {
    return await apiClient.get('/reportes').then(res => res.data);
  },
  async getById(id: number): Promise<ReporteDetail> {
    return await apiClient.get(`/reportes/${id}`).then(res => res.data);
  },
  async getByArea(areaId: number): Promise<ReporteResumen[]> {
    return await apiClient.get(`/reportes/area/${areaId}`).then(res => res.data);
  },
  async getByObra(obraId: number): Promise<ReporteResumen[]> {
    return await apiClient.get(`/reportes/obra/${obraId}`).then(res => res.data);
  },
  async getByUsuario(usuarioId: number): Promise<ReporteResumen[]> {
    return await apiClient.get(`/reportes/usuario/${usuarioId}`).then(res => res.data);
  },
  async getByCoordinador(coordinadorId: number): Promise<ReporteResumen[]> {
    return await apiClient.get(`/reportes/obras-coordinador/${coordinadorId}`).then(res => res.data);
  },
  async create(data: FormData): Promise<{ id: number; imagen_url: string }> {
    return await apiClient.post('/reportes', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
  async update(id: number, data: FormData): Promise<void> {
    await apiClient.put(`/reportes/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  async remove(id: number): Promise<void> {
    await apiClient.delete(`/reportes/${id}`);
  },
  async detectInfracciones(imagen: File): Promise<{ infracciones: { clase: string }[] }> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return await apiClient.post('/reportes/detect-infracciones', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
  async getCategoriasEpp(): Promise<CategoriaEpp[]> {
    return await apiClient.get('/categoriaEpps').then(res => res.data);
  },
  async updateEstado(id: number, estado: string): Promise<void> {
    await apiClient.patch(`/reportes/${id}/estado`, { estado });
  }
};