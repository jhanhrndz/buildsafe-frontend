import React, { useState, useMemo } from 'react';
import AreaCard from './AreaCard';
import AreaEmptyState from './AreaEmptyState';
import AreaForm from './AreaForm';
import type { Area, User } from '../../types/entities';
import { PlusCircle, Search } from 'lucide-react';

interface AreaListProps {
  areas: Area[];
  isLoading: boolean;
  isCoordinador: boolean;
  obraId: number;
  currentUserId?: number; // ID del usuario actual para supervisores
  onCreateArea?: (areaData: Omit<Area, 'id_area'>) => Promise<void>;
  onUpdateArea?: (areaData: Area) => Promise<void>;
  onDeleteArea?: (areaId: number) => Promise<void>;
  supervisores?: User[]; // Lista de supervisores disponibles
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const AreaList: React.FC<AreaListProps> = ({
  areas,
  isLoading,
  isCoordinador,
  obraId,
  currentUserId,
  onCreateArea,
  onUpdateArea,
  onDeleteArea,
  supervisores = [],
  searchTerm = '',
  onSearchChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Para un supervisor, filtrar solo sus áreas asignadas
  const filteredAreas = useMemo(() => {
    let result = areas;
    
    // Si no es coordinador (es supervisor), mostrar solo sus áreas asignadas
    if (!isCoordinador && currentUserId) {
      result = areas.filter(area => area.id_supervisor === currentUserId);
    }
    
    // Aplicar filtro de búsqueda si hay término
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(area => 
        area.nombre.toLowerCase().includes(searchLower) ||
        (area.descripcion && area.descripcion.toLowerCase().includes(searchLower))
      );
    }
    
    return result;
  }, [areas, searchTerm, isCoordinador, currentUserId]);

  const handleOpenCreateModal = () => {
    setEditingArea(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (area: Area) => {
    setEditingArea(area);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArea(undefined);
  };

  const handleSubmit = async (areaData: Omit<Area, 'id_area'> | Area) => {
    setIsSubmitting(true);
    try {
      if ('id_area' in areaData && onUpdateArea) {
        await onUpdateArea(areaData as Area);
      } else if (onCreateArea) {
        await onCreateArea(areaData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el área:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (areaId: number) => {
    if (onDeleteArea) {
      // Aquí podrías mostrar una confirmación antes de eliminar
      if (window.confirm('¿Estás seguro de que deseas eliminar esta área? Esta acción no se puede deshacer.')) {
        onDeleteArea(areaId);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Para mostrar mensajes vacíos diferenciados por rol
  if (filteredAreas.length === 0) {
    return (
      <div className="space-y-6">
        {/* Buscador (siempre visible) */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Buscar áreas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={16} />
          </div>
        </div>
        
        <AreaEmptyState
          searchTerm={searchTerm}
          isCoordinador={isCoordinador}
          onCreateClick={isCoordinador ? handleOpenCreateModal : undefined}
        />
        
        {/* Modal para crear/editar área */}
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
  }

  return (
    <div className="space-y-6">
      {/* Cabecera con buscador y botón de crear (solo para coordinador) */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Buscar áreas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={16} />
          </div>
        </div>
        
        {isCoordinador && (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
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
            obraId={obraId} // Pasamos el obraId al AreaCard
            isCoordinador={isCoordinador}
            onEdit={isCoordinador ? handleOpenEditModal : undefined}
            onDelete={isCoordinador ? handleDelete : undefined}
          />
        ))}
      </div>

      {/* Modal para crear/editar área */}
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