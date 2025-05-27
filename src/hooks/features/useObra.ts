import { useObrasContext } from '../../context/ObrasContext';
import type { Obra } from '../../types/entities';

export const useObra = () => {
  const context = useObrasContext();
  
  // Debugging: Verifica el estado actual del contexto
  console.log('Contexto de Obras:', {
    obrasCount: context.obras.length,
    isLoading: context.isLoading,
    error: context.error
  });

  // Proxy para métodos para agregar logging
  const enhancedContext = {
    ...context,
    createObra: async (data: Omit<Obra, 'id_obra'>) => {
      console.log('Iniciando creación de obra desde hook');
      return context.createObra(data);
    },
    deleteObra: async (id: number) => {
      console.log(`Iniciando eliminación de obra ${id} desde hook`);
      return context.deleteObra(id);
    },
    updateObra: async (obra: Obra) => {
      console.log(`Iniciando actualización de obra ${obra.id_obra} desde hook`);
      return context.updateObra(obra);
    },
    
  };

  return enhancedContext;
};

// Tipo de retorno inferido automáticamente
export type UseObraReturn = ReturnType<typeof useObra>;