//services/area.ts
import { useApi } from '../hooks/api';
import type { Area } from '../types/entities';

const { get, post, put, del } = useApi();

export const getAreaById = async (id: number): Promise<Area> => {
  return await get(`/areas/${id}`);
}

export const getAreasByObra = async (obraId: number): Promise<Area[]> => {
  return await get(`/areas/obra/${obraId}`);
};

export const getAreaAsignada = async (id_obra: number, id_usuario: number): Promise<Area> => {
  return await get(`/areas/obra/${id_obra}/supervisor/${id_usuario}`);
};

export const createArea = async (data: Omit<Area, 'id_area'>): Promise<void> => {
  return await post('/areas', data);
};

export const updateArea = async (area: Area): Promise<Area> => {
  const updated = await put(`/areas/${area.id_area}`, area);
  return updated as Area; // 👈 aquí aclaras que "updated" es un Area
};


export const deleteArea = async (id: number): Promise<void> => {
  return await del(`/areas/${id}`);
};
