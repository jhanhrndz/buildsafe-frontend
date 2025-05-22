import React, { useState, useMemo } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import AreaCard from './AreaCard';
import AreaEmptyState from './AreaEmptyState';
import AreaForm from './AreaForm';
import type { Area, User } from '../../types/entities';

interface AreaListProps {
  areas: Area[];
  isLoading: boolean;
  isCoordinador: boolean;
  obraId: number;
  currentUserId?: number;
  onCreateArea?: (areaData: Omit<Area, 'id_area'>) => Promise<void>;
  onUpdateArea?: (areaData: Area) => Promise<void>;
  onDeleteArea?: (areaId: number) => Promise<void>;
  onViewDetails?: (areaId: number) => void; // ✅ Agregada esta prop
  supervisores?: User[];
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
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar áreas según rol y búsqueda
  const filteredAreas = useMemo(() => {
    let result = areas;

    if (!isCoordinador && currentUserId) {
      result = result.filter(area => area.id_usuario === currentUserId);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(area =>
        area.nombre.toLowerCase().includes(term) ||
        (area.descripcion?.toLowerCase().includes(term) || '')
      );
    }

    return result;
  }, [areas, isCoordinador, currentUserId, searchTerm]);

  // Crear / editar
  const handleSubmit = async (areaData: Omit<Area, 'id_area'> | Area) => {
    setIsSubmitting(true);
    try {
      if ('id_area' in areaData && onUpdateArea) {
        await onUpdateArea(areaData);
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

  // Eliminar
  const handleDelete = async (areaId: number) => {
    if (
      onDeleteArea &&
      window.confirm('¿Estás seguro de eliminar esta área? Esta acción no se puede deshacer.')
    ) {
      await onDeleteArea(areaId);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingArea(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (area: Area) => {
    setEditingArea(area);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingArea(undefined);
    setIsModalOpen(false);
  };

  // Cargando
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Vacío
  if (filteredAreas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar áreas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  // Lista completa
  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar áreas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={16} />
          </div>
        </div>

        {isCoordinador && (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <PlusCircle size={16} className="mr-2" />
            Nueva Área
          </button>
        )}
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map((area) => (
          <AreaCard
            key={area.id_area}
            area={area}
            obraId={obraId}
            isCoordinador={isCoordinador}
            onEdit={isCoordinador ? handleOpenEditModal : undefined}
            onDelete={isCoordinador ? handleDelete : undefined}
          />
        ))}
      </div>

      {/* Modal */}
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
