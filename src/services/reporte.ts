// services/reporte.service.ts
import { apiClient } from '../hooks/api';
import type { 
  ReporteResumen,
  ReporteDetail,
  ReporteFilters,
  ReportesResponse,
  CreateReportePayload
} from '../types/entities';

export const ReporteService = {
  // Obtener todos los reportes
  async getAll(): Promise<ReporteResumen[]> {
    return await apiClient.get('/reportes').then(r => r.data);
  },

  // Obtener reportes por área
  async getByArea(id_area: number, filters?: ReporteFilters): Promise<ReportesResponse> {
    const params = new URLSearchParams();
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.fecha_desde) params.append('fecha_desde', filters.fecha_desde);
    if (filters?.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta);
    
    const url = `/reportes/area/${id_area}${params.toString() ? '?' + params.toString() : ''}`;
    return await apiClient.get(url).then(r => r.data);
  },

  // Obtener reportes por obra
  async getByObra(id_obra: number, filters?: ReporteFilters): Promise<ReportesResponse> {
    const params = new URLSearchParams();
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const url = `/reportes/obra/${id_obra}${params.toString() ? '?' + params.toString() : ''}`;
    return await apiClient.get(url).then(r => r.data);
  },

  // Obtener reporte por ID con detalles
  async getById(id: number): Promise<ReporteDetail> {
    return await apiClient.get(`/reportes/${id}`).then(r => r.data);
  },

  // Crear reporte
  async create(data: CreateReportePayload): Promise<ReporteDetail> {
    return await apiClient.post('/reportes', data).then(r => r.data);
  },

  // Actualizar estado de reporte
  async updateStatus(id: number, estado: 'pendiente' | 'en_revision' | 'resuelto'): Promise<ReporteDetail> {
    return await apiClient.put(`/reportes/${id}/status`, { estado }).then(r => r.data);
  }
};