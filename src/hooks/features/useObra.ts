import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserContext } from '../../context/UserContext';
import type { Obra } from '../../types/entities';
import * as obraService from '../../services/obra';

export const useObra = () => {
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  // Obtener obras del usuario autenticado
  const fetchObras = useQuery<Obra[]>({
    queryKey: ['obras'],
    queryFn: () => obraService.getObrasByUsuario(user!.id_usuario),
    enabled: !!user?.id_usuario,
  });

  // Retorna una función que crea un query para una obra específica
  const getObraById = (id: number) =>
    useQuery<Obra>({
      queryKey: ['obra', id],
      queryFn: () => obraService.getObraById(id),
      enabled: !!id,
    });

  const createObra = useMutation({
    mutationFn: obraService.createObra,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['obras'] }),
  });

  const updateObra = useMutation({
    mutationFn: obraService.updateObra,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['obras'] }),
  });

  const deleteObra = useMutation({
    mutationFn: obraService.deleteObra,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['obras'] }),
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
