// src/hooks/obraUsuario/useObraUsuario.ts
import { useState } from 'react';
import { obraUsuarioService } from '../../services/obraUsuario';
import type { User, SupervisorWithAreas } from '../../types/entities';

export const useObraUsuario = (obraId?: number) => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [supervisores, setSupervisores] = useState<SupervisorWithAreas[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    if (!obraId) return;
    setLoading(true);
    try {
      const data = await obraUsuarioService.getUsuariosByObra(obraId);
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupervisores = async () => {
    if (!obraId) return;
    setLoading(true);
    try {
      const data = await obraUsuarioService.getSupervisoresConAreas(obraId);
      setSupervisores(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar supervisores');
    } finally {
      setLoading(false);
    }
  };

  const asignarSupervisor = async (usuarioId: number) => {
    if (!obraId) return;
    setLoading(true);
    try {
      await obraUsuarioService.assignSupervisor(obraId, usuarioId);
      await fetchUsuarios(); // actualiza
    } catch (err: any) {
      setError(err.message || 'Error al asignar supervisor');
    } finally {
      setLoading(false);
    }
  };

  const eliminarSupervisor = async (usuarioId: number) => {
    if (!obraId) return;
    setLoading(true);
    try {
      await obraUsuarioService.removeSupervisor(obraId, usuarioId);
      await fetchUsuarios(); // actualiza
    } catch (err: any) {
      setError(err.message || 'Error al eliminar supervisor');
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarios,
    supervisores,
    loading,
    error,
    fetchUsuarios,
    fetchSupervisores,
    asignarSupervisor,
    eliminarSupervisor,
    clearError: () => setError(null),
  };
};
