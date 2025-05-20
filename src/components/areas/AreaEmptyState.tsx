// src/components/areas/AreaEmptyState.tsx
import React from 'react';
import { FolderPlus, Search } from 'lucide-react';

interface AreaEmptyStateProps {
  searchTerm?: string;
  isCoordinador: boolean;
  onCreateClick?: () => void;
}

const AreaEmptyState: React.FC<AreaEmptyStateProps> = ({
  searchTerm,
  isCoordinador,
  onCreateClick
}) => {
  // Si hay término de búsqueda, mostrar mensaje de no resultados
  if (searchTerm && searchTerm.trim() !== '') {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <Search size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
        <p className="text-gray-600 max-w-md">
          No hay áreas que coincidan con "{searchTerm}". Intenta con otro término o elimina el filtro.
        </p>
      </div>
    );
  }

  // Si es supervisor sin áreas asignadas
  if (!isCoordinador) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <FolderPlus size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes áreas asignadas</h3>
        <p className="text-gray-600 max-w-md">
          Actualmente no tienes áreas asignadas en esta obra. Comunícate con el coordinador para la asignación.
        </p>
      </div>
    );
  }

  // Si es coordinador y no hay áreas
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200 text-center">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <FolderPlus size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay áreas creadas</h3>
      <p className="text-gray-600 max-w-md mb-4">
        Aún no has creado áreas para esta obra. Las áreas te permiten organizar espacios y asignar supervisores.
      </p>
      {isCoordinador && onCreateClick && (
        <button
          onClick={onCreateClick}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <FolderPlus size={16} className="mr-2" />
          Crear primera área
        </button>
      )}
    </div>
  );
};

export default AreaEmptyState;