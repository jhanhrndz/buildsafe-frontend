import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../api';
import type { Camara } from '../../types/entities';

export const useCamara = () => {
  const { get, post, put, del } = useApi();
  const queryClient = useQueryClient();

  // Cámaras activas por área
  const getActiveByArea = (id_area: number) => useQuery<Camara[]>({
    queryKey: ['camaras', 'activas', id_area],
    queryFn: () => get(`/camaras/area/${id_area}/activas`),
    enabled: !!id_area
  });

  // Actualizar última conexión
 // const updateLastConnection = useMutation({
 //   mutationFn: (id_camara: number) => 
 //     put(`/camaras/${id_camara}/last-connection`),
 //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['camaras'] })
 // });

  return {
    getActiveByArea
  };
};