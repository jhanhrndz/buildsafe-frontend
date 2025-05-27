import React, { useState, useMemo } from 'react';
import { PlusCircle, Search, AlertCircle } from 'lucide-react';
import AreaCard from './AreaCard';
import AreaEmptyState from './AreaEmptyState';
import AreaForm from './AreaForm';
import type { Area, User } from '../../types/entities';

interface AreaListProps {
  areas: Area[];
  isLoading: boolean;
  isCoordinador: boolean;
  obraId: number;
  error?: string | null;
  currentUserId?: number;
  onCreateArea?: (areaData: Omit<Area, 'id_area'>) => Promise<boolean>;
  onUpdateArea?: (areaData: Area) => Promise<boolean>;
  onDeleteArea?: (areaId: number) => Promise<boolean>;
  onViewDetails?: (areaId: number) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  supervisores?: User[];
}

const AreaList: React.FC<AreaListProps> = ({
  areas,
  isLoading,
  isCoordinador,
  error,
  obraId,
  currentUserId,
  onCreateArea,
  onUpdateArea,
  onDeleteArea,
  onViewDetails,
  searchTerm = '',
  onSearchChange,
  supervisores = [],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar áreas con memoización
  const filteredAreas = useMemo(() => {
    let result = areas;

    // Filtrado por rol de usuario
    if (!isCoordinador && currentUserId) {
      result = result.filter(area => area.id_usuario === currentUserId);
    }

    // Filtrado por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(area =>
        area.nombre.toLowerCase().includes(term) ||
        (area.descripcion?.toLowerCase().includes(term) || '')
      );
    }

    return result;
  }, [areas, isCoordinador, currentUserId, searchTerm]);

  // Manejar creación/actualización
  const handleSubmit = async (areaData: Area | Omit<Area, 'id_area'>) => {
    setIsSubmitting(true);
    try {
      let success = false;
      if ('id_area' in areaData) {
        if (onUpdateArea) success = await onUpdateArea(areaData);
      } else {
        if (onCreateArea) success = await onCreateArea(areaData);
      }
      if (success) setIsModalOpen(false);
      return success;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar eliminación con confirmación
  const handleDelete = async (areaId: number) => {
    if (!onDeleteArea) return;
    
    if (window.confirm('¿Estás seguro de eliminar esta área?')) {
      try {
        await onDeleteArea(areaId);
      } catch (error) {
        console.error('Error eliminando área:', error);
        alert('No se pudo eliminar el área');
      }
    }
  };

  // Manejar cambio de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    onSearchChange?.(term);
  };

  // Cerrar modal y limpiar estado
  const handleCloseModal = () => {
    setEditingArea(undefined);
    setIsModalOpen(false);
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Mostrar errores
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar estado vacío
  if (filteredAreas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar áreas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <AreaEmptyState
          searchTerm={searchTerm}
          isCoordinador={isCoordinador}
          onCreateClick={isCoordinador ? () => setIsModalOpen(true) : undefined}
        />
      </div>
    );
  }

  // Lista principal
  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y acciones */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar áreas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isCoordinador && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            <PlusCircle size={16} className="mr-2" />
            Nueva Área
          </button>
        )}
      </div>

      {/* Grid de áreas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map((area) => (
          <AreaCard
            key={area.id_area}
            area={area}
            obraId={obraId}
            isCoordinador={isCoordinador}
            onEdit={isCoordinador ? (a) => {
              setEditingArea(a);
              setIsModalOpen(true);
            } : undefined}
            onDelete={isCoordinador ? handleDelete : undefined}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Modal de creación/edición */}
      {isModalOpen && (
        <AreaForm
          onClose={handleCloseModal}
          obraId={obraId}
          areaToEdit={editingArea}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          supervisores={supervisores}
        />
      )}
    </div>
  );
};

export default AreaList;