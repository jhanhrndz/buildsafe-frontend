import React, { useState, useEffect } from 'react';
import AreaList from './AreaList';
import type { Area, User } from '../../types/entities';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import AreaForm from './AreaForm';

interface AreaTabsContentProps {
  obraId: number;
  isCoordinador: boolean;
  currentUserId?: number; // ID del usuario actual para supervisores
  areas: Area[];
  isLoading: boolean;
  error: string | null; // Cambiar de Error | null a string | null
  supervisores?: User[]; // Lista de supervisores disponibles
  onCreateArea?: (areaData: Omit<Area, 'id_area'>) => Promise<boolean>;
  onUpdateArea?: (areaData: Area) => Promise<boolean>;
  onDeleteArea?: (areaId: number) => Promise<boolean>;
  onViewAreaDetails?: (areaId: number) => void;
}

const AreaTabsContent: React.FC<AreaTabsContentProps> = ({
  obraId,
  isCoordinador,
  currentUserId,
  areas,
  isLoading,
  error,
  supervisores = [],
  onCreateArea,
  onUpdateArea,
  onDeleteArea,
  onViewAreaDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si hay errores, mostramos mensaje de error
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-red-50 to-red-100/80 border border-red-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Error al cargar las áreas
                </h3>
                <p className="text-sm text-red-700 leading-relaxed mb-4">
                  Hubo un problema al obtener la información. Por favor, intenta de nuevo.
                </p>
                <div className="text-xs text-red-600/80 bg-red-50 px-3 py-2 rounded-lg border border-red-200/50">
                  <strong>Detalles:</strong> {error}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenModal = (area?: Area) => {
    setEditingArea(area || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingArea(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (areaData: Omit<Area, 'id_area'>) => {
    setIsSubmitting(true);
    try {
      if (editingArea) {
        // Actualizar área
        if (onUpdateArea) {
          await onUpdateArea({ ...areaData, id_area: editingArea.id_area });
        }
      } else {
        // Crear nueva área
        if (onCreateArea) {
          await onCreateArea(areaData);
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el área:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Contenedor principal con mejor espaciado */}
      <div className="bg-white rounded-xl  ">
        {/* Lista de áreas con toda la funcionalidad */}
        <AreaList
          areas={areas}
          isLoading={isLoading}
          isCoordinador={isCoordinador}
          currentUserId={currentUserId}
          obraId={obraId}
          supervisores={supervisores} // <-- PASA AQUÍ
          onCreateArea={onCreateArea}
          onUpdateArea={onUpdateArea}
          onDeleteArea={onDeleteArea}
          onViewDetails={onViewAreaDetails}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {isModalOpen && (
        <AreaForm
          onClose={handleCloseModal}
          obraId={obraId}
          areaToEdit={editingArea ?? undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          supervisores={supervisores} // <-- PASA AQUÍ
          isCoordinador={isCoordinador}
        />
      )}
    </div>
  );
};

export default AreaTabsContent;