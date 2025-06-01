import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ReporteService } from '../services/reporte';
import type { ReporteResumen, ReporteDetail, CategoriaEpp } from '../types/entities';

// Tipo para la respuesta de la IA
type InfraccionIA = { clase: string };

type ReportsContextType = {
  reportes: ReporteResumen[];
  isLoading: boolean;
  error: string | null;
  refreshByArea: (areaId: number) => Promise<void>;
  refreshByObra: (obraId: number) => Promise<void>;
  refreshByUsuario: (usuarioId: number) => Promise<void>;
  refreshByCoordinador: (coordinadorId: number) => Promise<void>;
  getById: (id: number) => Promise<ReporteDetail | null>;
  create: (data: FormData) => Promise<boolean>;
  update: (id: number, data: FormData) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
  detectInfracciones: (imagen: File) => Promise<InfraccionIA[]>;
  categoriasEpp: CategoriaEpp[];
  loadCategoriasEpp: () => Promise<void>;
  clearError: () => void;
  updateEstadoReporte: (id: number, estado: string) => Promise<boolean>;
};

const ReportsContext = createContext<ReportsContextType>({} as ReportsContextType);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reportes, setReportes] = useState<ReporteResumen[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriasEpp, setCategoriasEpp] = useState<CategoriaEpp[]>([]);

  const refreshByArea = useCallback(async (areaId: number) => {
    setIsLoading(true); setError(null);
    try {
      setReportes(await ReporteService.getByArea(areaId)); // o getByObra, etc.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar reportes');
    } finally { setIsLoading(false); }
  }, []);

  const refreshByObra = useCallback(async (obraId: number) => {
    setIsLoading(true); setError(null);
    try {
      setReportes(await ReporteService.getByObra(obraId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar reportes');
    } finally { setIsLoading(false); }
  }, []);

  const refreshByUsuario = useCallback(async (usuarioId: number) => {
    setIsLoading(true); setError(null);
    try {
      setReportes(await ReporteService.getByUsuario(usuarioId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar reportes');
    } finally { setIsLoading(false); }
  }, []);

  const refreshByCoordinador = useCallback(async (coordinadorId: number) => {
    setIsLoading(true); setError(null);
    try {
      setReportes(await ReporteService.getByCoordinador(coordinadorId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar reportes');
    } finally { setIsLoading(false); }
  }, []);

  const getById = useCallback(async (id: number) => {
    try {
      return await ReporteService.getById(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener reporte');
      return null;
    }
  }, []);

  const create = useCallback(async (data: FormData) => {
    try {
      await ReporteService.create(data);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear reporte');
      return false;
    }
  }, []);

  const update = useCallback(async (id: number, data: FormData) => {
    try {
      await ReporteService.update(id, data);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar reporte');
      return false;
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      await ReporteService.remove(id);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar reporte');
      return false;
    }
  }, []);

  const detectInfracciones = useCallback(async (imagen: File): Promise<InfraccionIA[]> => {
    try {
      const res = await ReporteService.detectInfracciones(imagen);
      // res debe ser { infracciones: [{ clase: string }, ...] }
      if (res && Array.isArray(res.infracciones)) {
        return res.infracciones;
      }
      return [];
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al analizar imagen');
      return [];
    }
  }, []);

  const loadCategoriasEpp = useCallback(async () => {
    try {
      setCategoriasEpp(await ReporteService.getCategoriasEpp());
    } catch (e) {
      setCategoriasEpp([]);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const updateEstadoReporte = useCallback(async (id: number, estado: string) => {
    try {
      await ReporteService.updateEstado(id, estado);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cambiar estado');
      return false;
    }
  }, []);

  return (
    <ReportsContext.Provider value={{
      reportes,
      isLoading,
      error,
      refreshByArea,
      refreshByObra,
      refreshByUsuario,
      refreshByCoordinador,
      getById,
      create,
      update,
      remove,
      detectInfracciones,
      categoriasEpp,
      loadCategoriasEpp,
      clearError,
      updateEstadoReporte,
    }}>
      {children}
    </ReportsContext.Provider>
  );
}

export const useReportsContext = () => {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReportsContext debe usarse dentro de ReportsProvider');
  return ctx;
};