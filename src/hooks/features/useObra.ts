import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../api';
import { useUserContext } from '../../context/UserContext';
import type { Obra } from '../../types/entities';

export const useObra = () => {
  const { get, post, put, del } = useApi();
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  // Obtener obras del usuario autenticado
  const fetchObras = useQuery<Obra[]>({
    queryKey: ['obras'],
    queryFn: () => get(`/obras/mis-obras/${user?.id_usuario}`),
    enabled: !!user?.id_usuario, // asegura que solo ejecute si hay un ID válido
  });

  const getObraById = (id: number) => {
    return useQuery<Obra>({
      queryKey: ['obra', id],
      queryFn: () => get(`/obras/${id}`),
      enabled: !!id, // solo corre si id tiene valor
    });
  }
  // Crear nueva obra
  const createObra = useMutation({
    mutationFn: (nuevaObra: Omit<Obra, 'id_obra'>) => post('/obras', nuevaObra),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['obras'] })
  });

  // Actualizar obra
  const updateObra = useMutation({
    mutationFn: (obraActualizada: Obra) => put(`/obras/${obraActualizada.id_obra}`, obraActualizada),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['obras'] })
  });

  // Eliminar obra
  const deleteObra = useMutation({
    mutationFn: (id: number) => del(`/obras/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['obras'] })
  });

  return {
    obras: fetchObras.data || [],
    isLoading: fetchObras.isLoading,
    error: fetchObras.error,
    createObra,
    updateObra,
    deleteObra,
    getObraById,
  };
};