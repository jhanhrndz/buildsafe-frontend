// src/hooks/features/useObra.ts
import { useState, useCallback, useEffect } from 'react';
import * as obraService from '../../services/obra';
import { useUserContext } from '../../context/UserContext';
import type { Obra } from '../../types/entities';

export const useObra = () => {
  const { user } = useUserContext();
  const [obras, setObras] = useState<Obra[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchObras = useCallback(async () => {
    if (!user?.id_usuario) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await obraService.ObraService.getMisObras(user.id_usuario);
      setObras(data);
    } catch (err) {
      console.error('Error al cargar obras:', err);
      setError('No se pudieron cargar las obras');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id_usuario]);

  const getObraById = useCallback(async (id: number): Promise<Obra | null> => {
    try {
      return await obraService.ObraService.getById(id);
    } catch (err) {
      console.error('Error al obtener obra:', err);
      return null;
    }
  }, []);

  const create = useCallback(async (obra: Omit<Obra, 'id_obra'>): Promise<boolean> => {
    try {
      await obraService.ObraService.create(obra);
      await fetchObras();
      return true;
    } catch (err) {
      console.error('Error creando obra:', err);
      setError('No se pudo crear la obra');
      return false;
    }
  }, [fetchObras]);

  const update = useCallback(async (obra: Obra): Promise<boolean> => {
    try {
      await obraService.ObraService.update(obra);
      await fetchObras();
      return true;
    } catch (err) {
      console.error('Error actualizando obra:', err);
      setError('No se pudo actualizar la obra');
      return false;
    }
  }, [fetchObras]);

  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await obraService.ObraService.remove(id);
      await fetchObras();
      return true;
    } catch (err) {
      console.error('Error eliminando obra:', err);
      setError('No se pudo eliminar la obra');
      return false;
    }
  }, [fetchObras]);

  const clearError = () => setError(null);

  useEffect(() => {
    fetchObras();
  }, [fetchObras]);

  return {
    obras,
    isLoading,
    error,
    fetchObras,
    getObraById,
    create,
    update,
    remove,
    clearError,
  };
};
