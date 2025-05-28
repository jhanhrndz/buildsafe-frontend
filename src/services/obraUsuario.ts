// src/services/obraUsuario.ts
import { apiClient } from '../hooks/api';
import type { User, SupervisorWithAreas } from '../types/entities';

export const obraUsuarioService = {
  // Obtener todos los usuarios de una obra
  async getUsuariosByObra(obraId: number): Promise<User[]> {
    return (await apiClient.get(`/obras/${obraId}/usuarios`)).data;
  },

  // Asignar supervisor a una obra por EMAIL
  async assignSupervisorByEmail(obraId: number, email: string): Promise<void> {
    await apiClient.post(`/obraUsuarios/obras/${obraId}/supervisores`, { email });
  },

  // Quitar supervisor de una obra por EMAIL
  async removeSupervisorByEmail(obraId: number, email: string): Promise<void> {
    await apiClient.delete(`/obraUsuarios/obras/${obraId}/supervisores`, { data: { email } });
  },

  // Quitar supervisor de una obra por ID
  async removeSupervisorById(obraId: number, usuarioId: number): Promise<void> {
    await apiClient.delete(`/obraUsuarios/obras/${obraId}/supervisores/${usuarioId}`);
  },

  // Obtener supervisores de una obra con sus áreas
  async getSupervisoresConAreas(obraId: number): Promise<SupervisorWithAreas[]> {
    return (await apiClient.get(`/obraUsuarios/obras/${obraId}/supervisores`)).data;
  },
};
