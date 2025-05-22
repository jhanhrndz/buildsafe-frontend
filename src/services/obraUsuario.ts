// src/services/obraUsuario.ts
import { apiClient } from '../hooks/api';
import type { User, SupervisorWithAreas } from '../types/entities';

export const obraUsuarioService = {
  async getUsuariosByObra(obraId: number): Promise<User[]> {
    return (await apiClient.get(`/obras/${obraId}/usuarios`)).data;
  },

  async assignSupervisor(obraId: number, usuarioId: number): Promise<void> {
    await apiClient.post('/obraUsuarios', { obraId, usuarioId });
  },

  async removeSupervisor(obraId: number, usuarioId: number): Promise<void> {
    await apiClient.delete(`/obraUsuarios/${obraId}/supervisores/${usuarioId}`);
  },

  async getSupervisoresConAreas(obraId: number): Promise<SupervisorWithAreas[]> {
    return (await apiClient.get(`/obraUsuarios/${obraId}/supervisores-con-areas`)).data;
  },
};
