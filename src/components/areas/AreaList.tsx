import React, { useState, useMemo } from 'react';
import { PlusCircle, Search, AlertCircle, Loader2, MapPin } from 'lucide-react';
import AreaCard from './AreaCard';
import AreaEmptyState from './AreaEmptyState';
import AreaForm from './AreaForm';
import type { Area, User } from '../../types/entities';
import ConfirmDialog from '../shared/ConfirmDialog';
import { useCamarasContext } from '../../context/CamarasContext';
import { useReportsContext } from '../../context/ReportsContext';

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
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { camaras } = useCamarasContext();
  const { reportes } = useReportsContext();
  const getReportesCount = (areaId: number) =>
    reportes.filter(r => r.id_area === areaId).length;

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

  const supervisoresMap = useMemo(() => {
    const map = new Map<number, User>();
    supervisores.forEach(s => map.set(s.id_usuario, s));
    return map;
  }, [supervisores]);

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
  const handleRequestDelete = (area: Area) => {
    setAreaToDelete(area);
  };

  const handleConfirmDelete = async () => {
    if (!areaToDelete || !onDeleteArea) return;
    setIsDeleting(true);
    try {
      await onDeleteArea(areaToDelete.id_area);
      setAreaToDelete(null);
    } catch (e) {
      alert('No se pudo eliminar el área');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setAreaToDelete(null);
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
      <div className="flex justify-center items-center h-64 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-blue-600 font-medium">Cargando áreas...</p>
        </div>
      </div>
    );
  }

  // Mostrar errores
  if (error) {
    return (
      <div className="relative rounded-2xl border border-red-200/50 bg-gradient-to-r from-red-50/80 to-red-100/30 backdrop-blur-sm p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-red-800 mb-2 text-lg">Error al cargar áreas</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar estado vacío
  if (filteredAreas.length === 0) {
    return (
      <div className="p-8 space-y-8">
        {/* Enhanced Search Bar */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar áreas por nombre o descripción..."
            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
          />
        </div>

        <AreaEmptyState
          searchTerm={searchTerm}
          isCoordinador={isCoordinador}
          onCreateClick={isCoordinador ? () => {
            setEditingArea(undefined);
            setIsModalOpen(true);
          } : undefined}
        />

        {/* Modal de creación/edición */}
        {isModalOpen && (
          <AreaForm
            onClose={handleCloseModal}
            obraId={obraId}
            areaToEdit={editingArea}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            supervisores={supervisores}
            isCoordinador={isCoordinador}
          />
        )}
      </div>
    );
  }

  // Lista principal
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar áreas por nombre o descripción..."
            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
          />
        </div>

        {isCoordinador && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            <PlusCircle className="h-5 w-5" />
            Nueva Área
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredAreas.map((area) => {
          // Calcula el número de cámaras para esta área
          const camaras_count = camaras.filter(c => c.id_area === area.id_area).length;
          console.log('Reportes en contexto:', reportes);
          return (
            <AreaCard
              key={area.id_area}
              area={{
                ...area,
                supervisor: area.id_usuario ? supervisoresMap.get(area.id_usuario) : undefined,
                camaras_count,
                reportes_count: getReportesCount(area.id_area),
              }}
              obraId={obraId}
              isCoordinador={isCoordinador}
              onEdit={isCoordinador ? (a) => {
                console.log('Editando área:', a);
                setEditingArea(a);
                setIsModalOpen(true);
              } : undefined}
              onDelete={isCoordinador ? (aId) => {
                const areaObj = areas.find(a => a.id_area === aId);
                if (areaObj) handleRequestDelete(areaObj);
              } : undefined}
              onViewDetails={onViewDetails}
            />
          );
        })}
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
          isCoordinador={isCoordinador}
        />
      )}
      
      {areaToDelete && (
        <ConfirmDialog
          title="Eliminar área"
          message={`¿Estás seguro de que deseas eliminar el área "${areaToDelete.nombre}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </div>
  );
};

export default AreaList;