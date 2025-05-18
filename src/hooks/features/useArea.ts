import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../api';
import { useUserContext } from '../../context/UserContext';
import type { Area } from '../../types/entities';

export const useArea = () => {
  const { get, post, put, del } = useApi();
  const queryClient = useQueryClient();

  // Obtener todas las áreas
  const getAreas = useQuery<Area[]>({
    queryKey: ['areas'],
    queryFn: () => get('/areas'),
  });

  // Obtener áreas por obra
  const getAreasByObra = (obraId: number) => useQuery<Area[]>({
    queryKey: ['areas', obraId],
    queryFn: () => get(`/areas?obra=${obraId}`),
    enabled: !!obraId
  });

  // Crear área
  const createArea = useMutation({
    mutationFn: (newArea: Omit<Area, 'id_area'>) => post('/areas', newArea),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['areas'] })
  });

  // Actualizar supervisor
  const updateSupervisor = useMutation({
    mutationFn: ({ id_area, id_usuario }: { id_area: number; id_usuario: number }) => 
      put(`/areas/${id_area}/supervisor`, { id_usuario }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['areas'] })
  });

  return {
    areas: getAreas.data || [],
    getAreasByObra,
    createArea,
    updateSupervisor,
    isLoading: getAreas.isLoading,
    error: getAreas.error
  };
};