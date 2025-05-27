import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ObraService } from '../services/obra';
import { useUserContext } from './UserContext';
import type { Obra } from '../types/entities';

type ObrasContextType = {
  obras: Obra[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createObra: (data: Omit<Obra, 'id_obra'>) => Promise<boolean>;
  updateObra: (obra: Obra) => Promise<boolean>;
  deleteObra: (id: number) => Promise<boolean>;
  getObraById: (id: number) => Promise<Obra | null>;
  clearError: () => void;
};

const ObrasContext = createContext<ObrasContextType>({} as ObrasContextType);

export function ObrasProvider({ children }: { children: ReactNode }) {
  const { user } = useUserContext();
  const [obras, setObras] = useState<Obra[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Función principal de carga con useCallback para memoización
  const load = useCallback(async () => {
    console.log('Iniciando carga de obras...');
    if (!user?.id_usuario) {
      console.warn('No hay usuario autenticado para cargar obras');
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await ObraService.getMisObras(user.id_usuario);
      console.log('Obras cargadas correctamente:', data);
      setObras(data);
    } catch (error) {
      console.error('Error en carga de obras:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al cargar obras');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id_usuario]);  // Solo se recrea cuando cambia el ID de usuario

  // Operaciones CRUD con manejo de errores mejorado
  const createObra = useCallback(async (data: Omit<Obra, 'id_obra'>) => {
    try {
      console.log('Creando obra:', data);
      await ObraService.create(data);
      await load();  // Recargar datos después de crear
      return true;
    } catch (error) {
      console.error('Error creando obra:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al crear obra');
      return false;
    }
  }, [load]);

  const updateObra = useCallback(async (obra: Obra) => {
    try {
      console.log('Actualizando obra:', obra);
      await ObraService.update(obra);
      await load();  // Recargar datos después de actualizar
      return true;
    } catch (error) {
      console.error('Error actualizando obra:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al actualizar obra');
      return false;
    }
  }, [load]);

  const deleteObra = useCallback(async (id: number) => {
    try {
      console.log('Eliminando obra ID:', id);
      await ObraService.remove(id);
      await load();  // Recargar datos después de eliminar
      return true;
    } catch (error) {
      console.error('Error eliminando obra:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al eliminar obra');
      return false;
    }
  }, [load]);

  const getObraById = useCallback(async (id: number): Promise<Obra | null> => {
    try {
      console.log('Buscando obra ID:', id);
      return await ObraService.getById(id);
    } catch (error) {
      console.error('Error obteniendo obra por ID:', error);
      return null;
    }
  }, []);

  // Carga inicial y cuando cambia el usuario
  useEffect(() => {
    if (user?.id_usuario) {
      load();
    } else {
      setObras([]);  // Limpiar datos si no hay usuario
    }
  }, [user?.id_usuario, load]);

  return (
    <ObrasContext.Provider 
      value={{
        obras,
        isLoading,
        error,
        refresh: load,
        createObra,
        updateObra,
        deleteObra,
        getObraById,
        clearError
      }}
    >
      {children}
    </ObrasContext.Provider>
  );
}

export const useObrasContext = () => {
  const context = useContext(ObrasContext);
  if (!context) {
    throw new Error('useObrasContext debe usarse dentro de ObrasProvider');
  }
  return context;
};