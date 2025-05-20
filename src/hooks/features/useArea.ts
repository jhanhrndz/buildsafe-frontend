// src/hooks/features/useArea.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserContext } from '../../context/UserContext';
import type { Area } from '../../types/entities';
import * as areaService from '../../services/area';

// Hook flexible que puede recibir un obraId opcional
export const useArea = (obraId?: number) => {
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  // Obtener áreas por obra (si se proporciona obraId)
  const fetchAreas = useQuery<Area[]>({
    queryKey: ['areas', obraId],
    queryFn: () => obraId ? areaService.getAreasByObra(obraId) : [],
    enabled: !!obraId,
  });

  // Función para obtener un área específica por ID
  const getAreaById = (areaId: number) =>
    useQuery<Area>({
      queryKey: ['area', areaId],
      queryFn: () => areaService.getAreaById(areaId),
      enabled: !!areaId,
    });

  // Mutaciones para crear, actualizar y eliminar áreas
  const createArea = useMutation({
    mutationFn: areaService.createArea,
    onSuccess: () => {
      // Invalidamos queries relacionadas
      if (obraId) {
        queryClient.invalidateQueries({ queryKey: ['areas', obraId] });
      }
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });

  const updateArea = useMutation<Area, Error, Area>({
    mutationFn: areaService.updateArea,
    onSuccess: (updatedArea) => {
      if (obraId) {
        queryClient.invalidateQueries({ queryKey: ['areas', obraId] });
      }
      queryClient.invalidateQueries({ queryKey: ['area', updatedArea.id_area] });
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });


  const deleteArea = useMutation({
    mutationFn: areaService.deleteArea,
    onSuccess: (_, deletedAreaId) => {
      // Invalidamos queries relacionadas
      if (obraId) {
        queryClient.invalidateQueries({ queryKey: ['areas', obraId] });
      }
      queryClient.invalidateQueries({ queryKey: ['area', deletedAreaId] });
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });

  return {
    areas: fetchAreas.data || [],
    isLoading: fetchAreas.isLoading,
    error: fetchAreas.error,
    createArea,
    updateArea,
    deleteArea,
    getAreaById,
  };
};