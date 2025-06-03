import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CamaraService } from '../services/camara';
import type { Camara, CreateCamaraPayload, UpdateCamaraPayload } from '../types/entities';

type CamarasContextType = {
  camaras: Camara[];
  isLoading: boolean;
  error: string | null;
  refresh: (areaId: number, onlyActive?: boolean) => Promise<void>;
  refreshByObra: (obraId: number) => Promise<void>; // <-- agrega esto
  getById: (id: number) => Promise<Camara | null>;
  createCamara: (data: CreateCamaraPayload) => Promise<boolean>;
  updateCamara: (data: UpdateCamaraPayload) => Promise<boolean>;
  deleteCamara: (id: number) => Promise<boolean>;
  clearError: () => void;
  fetchCamarasAndReturn: (obraId: number) => Promise<Camara[]>; 
};

const CamarasContext = createContext<CamarasContextType>({} as CamarasContextType);

export function CamarasProvider({ children }: { children: ReactNode }) {
  const [camaras, setCamaras] = useState<Camara[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar cámaras de un área (todas o solo activas)
  const refresh = useCallback(async (areaId: number, onlyActive = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = onlyActive
        ? await CamaraService.getActiveByArea(areaId)
        : await CamaraService.getByArea(areaId);
      setCamaras(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar cámaras');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar todas las cámaras de una obra
  const refreshByObra = useCallback(async (obraId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Suponiendo que tienes un endpoint que devuelve todas las cámaras de la obra
      const data = await CamaraService.getByObra(obraId);
      setCamaras(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar cámaras');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: number): Promise<Camara | null> => {
    try {
      return await CamaraService.getById(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener cámara');
      return null;
    }
  }, []);

  const createCamara = useCallback(async (data: CreateCamaraPayload) => {
    try {
      await CamaraService.create(data);
      await refresh(data.id_area);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear cámara');
      return false;
    }
  }, [refresh]);

  const updateCamara = useCallback(async (data: UpdateCamaraPayload) => {
    try {
      await CamaraService.update(data);
      await refresh(data.id_area!);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar cámara');
      return false;
    }
  }, [refresh]);

  const deleteCamara = useCallback(async (id: number) => {
    try {
      const camara = await CamaraService.getById(id);
      if (!camara) throw new Error('Cámara no encontrada');
      await CamaraService.remove(id);
      await refresh(camara.id_area);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar cámara');
      return false;
    }
  }, [refresh]);

  const fetchCamarasAndReturn = useCallback(async (obraId: number) => {
    try {
      const data = await CamaraService.getByObra(obraId);
      return data;
    } catch (e) {
      return [];
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <CamarasContext.Provider
      value={{
        camaras,
        isLoading,
        error,
        refresh,
        refreshByObra, // <-- agrega esto
        getById,
        createCamara,
        updateCamara,
        deleteCamara,
        clearError,
        fetchCamarasAndReturn
      }}
    >
      {children}
    </CamarasContext.Provider>
  );
}

export const useCamarasContext = () => {
  const context = useContext(CamarasContext);
  if (!context) {
    throw new Error('useCamarasContext debe usarse dentro de CamarasProvider');
  }
  return context;
};