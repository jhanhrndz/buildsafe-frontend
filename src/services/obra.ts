import { useApi } from '../hooks/api';
import type { Obra } from '../types/entities';

const { get, post, put, del } = useApi();

export const getObrasByUsuario = async (userId: number): Promise<Obra[]> => {
  return await get(`/obras/mis-obras/${userId}`);
};

export const getObraById = async (id: number): Promise<Obra> => {
  return await get(`/obras/${id}`);
};

export const createObra = async (obra: Omit<Obra, 'id_obra'>): Promise<void> => {
  await post('/obras', obra);
};

export const updateObra = async (obra: Obra): Promise<void> => {
  await put(`/obras/${obra.id_obra}`, obra);
};

export const deleteObra = async (id: number): Promise<void> => {
  await del(`/obras/${id}`);
};
