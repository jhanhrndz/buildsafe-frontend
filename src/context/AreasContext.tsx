// src/context/AreasContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AreaService } from '../services/area';
import type { Area } from '../types/entities';

type AreasContextType = {
  areas: Area[];
  isLoading: boolean;
  error: string | null;
  refresh: (obraId: number) => Promise<void>;
  getById: (id: number) => Promise<Area | null>;
  getAsignada: (obraId: number, usuarioId: number) => Promise<Area | null>;
  createArea: (data: Omit<Area, 'id_area'>) => Promise<boolean>;
  updateArea: (area: Area) => Promise<boolean>;
  deleteArea: (id: number) => Promise<boolean>;
  clearError: () => void;
};

const AreasContext = createContext<AreasContextType>({} as AreasContextType);

export function AreasProvider({ children }: { children: ReactNode }) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadedObraId, setLastLoadedObraId] = useState<number | null>(null);

  const loadAreas = useCallback(async (obraId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AreaService.getByObra(obraId);
      setAreas(data);
      setLastLoadedObraId(obraId); // Guardamos el ID de la última obra cargada
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar áreas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createArea = useCallback(async (data: Omit<Area, 'id_area'>) => {
    try {
      await AreaService.create(data);
      if (lastLoadedObraId) await loadAreas(lastLoadedObraId);
      return true; // Asegurar retorno booleano
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear área');
      return false; // Asegurar retorno booleano
    }
  }, [lastLoadedObraId, loadAreas]);

  const updateArea = useCallback(async (area: Area) => {
    try {
      await AreaService.update(area);
      
      // Recargar áreas solo si pertenecen a la misma obra
      if (lastLoadedObraId && area.id_obra === lastLoadedObraId) {
        await loadAreas(lastLoadedObraId);
      }
      
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar área');
      return false;
    }
  }, [lastLoadedObraId, loadAreas]);

  const deleteArea = useCallback(async (id: number) => {
    try {
      await AreaService.remove(id);
      
      // Recargar áreas si tenemos una obra cargada
      if (lastLoadedObraId) {
        await loadAreas(lastLoadedObraId);
      }
      
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar área');
      return false;
    }
  }, [lastLoadedObraId, loadAreas]);

  const getById = useCallback(async (id: number): Promise<Area | null> => {
    try {
      return await AreaService.getById(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener área');
      return null;
    }
  }, []);

  const getAsignada = useCallback(async (obraId: number, usuarioId: number) => {
    try {
      return await AreaService.getAsignada(obraId, usuarioId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener área asignada');
      return null;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AreasContext.Provider
      value={{
        areas,
        isLoading,
        error,
        refresh: loadAreas,
        getById,
        getAsignada,
        createArea,
        updateArea,
        deleteArea,
        clearError,
      }}
    >
      {children}
    </AreasContext.Provider>
  );
}

export const useAreasContext = () => {
  const context = useContext(AreasContext);
  if (!context) {
    throw new Error('useAreasContext debe usarse dentro de AreasProvider');
  }
  return context;
};