// src/hooks/features/useArea.ts
import { useAreasContext } from '../../context/AreasContext';
import type { Area } from '../../types/entities';

export const useArea = () => {
  const context = useAreasContext();
  return context;
};

export type UseAreaReturn = ReturnType<typeof useArea>;