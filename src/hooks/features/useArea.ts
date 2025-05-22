// src/hooks/features/useArea.ts
import { useState, useCallback, useEffect } from 'react';
import { AreaService } from '../../services/area';
import type { Area } from '../../types/entities';

export const useArea = (obraId?: number) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Obtener todas o por obra
  const fetchAreas = useCallback(async () => {
    if (!obraId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await AreaService.getByObra(obraId);
      setAreas(data);
    } catch (err: any) {
      console.error('Error al cargar áreas:', err);
      setError(new Error('Mensaje de error'));

    } finally {
      setIsLoading(false);
    }
  }, [obraId]);

  // Cargar al montar
  useEffect(() => {
    if (obraId) fetchAreas();
  }, [fetchAreas, obraId]);

  const getAreaById = useCallback(async (id: number): Promise<Area | null> => {
    try {
      return await AreaService.getById(id);
    } catch (err) {
      console.error('Error al obtener área:', err);
      return null;
    }
  }, []);

  const getAsignada = useCallback(
    async (usuarioId: number): Promise<Area | null> => {
      if (!obraId) return null;
      try {
        return await AreaService.getAsignada(obraId, usuarioId);
      } catch (err) {
        console.error('Error al obtener área asignada:', err);
        return null;
      }
    },
    [obraId]
  );

  const create = useCallback(async (data: Omit<Area, 'id_area'>): Promise<Area | null> => {
    try {
      const nueva = await AreaService.create(data);
      await fetchAreas();
      return nueva;
    } catch (err: any) {
      console.error('Error creando área:', err);
      setError(new Error('Mensaje de error'));

      return null;
    }
  }, [fetchAreas]);

  const update = useCallback(async (area: Area): Promise<boolean> => {
    try {
      await AreaService.update(area);
      await fetchAreas();
      return true;
    } catch (err: any) {
      console.error('Error actualizando área:', err);
      setError(new Error('Mensaje de error'));

      return false;
    }
  }, [fetchAreas]);

  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await AreaService.remove(id);
      await fetchAreas();
      return true;
    } catch (err: any) {
      console.error('Error eliminando área:', err);
      setError(new Error('Mensaje de error'));

      return false;
    }
  }, [fetchAreas]);

  const clearError = () => setError(null);

  return {
    areas,
    isLoading,
    error,
    fetchAreas,
    getAreaById,
    getAsignada,
    create,
    update,
    remove,
    clearError
  };
};
