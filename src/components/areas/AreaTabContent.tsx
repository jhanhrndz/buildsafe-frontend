import React, { useState, useEffect } from 'react';
import AreaList from './AreaList';
import type { Area, User } from '../../types/entities';
import { AlertCircle } from 'lucide-react';

interface AreaTabsContentProps {
  obraId: number;
  isCoordinador: boolean;
  currentUserId?: number; // ID del usuario actual para supervisores
  areas: Area[];
  isLoading: boolean;
  error: Error | null;
  supervisores?: User[]; // Lista de supervisores disponibles
  onCreateArea?: (areaData: Omit<Area, 'id_area'>) => Promise<void>;
  onUpdateArea?: (areaData: Area) => Promise<void>;
  onDeleteArea?: (areaId: number) => Promise<void>;
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

  // Si hay errores, mostramos mensaje de error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar las áreas</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Hubo un problema al obtener la información. Por favor, intenta de nuevo.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lista de áreas con toda la funcionalidad */}
      <AreaList
        areas={areas}
        isLoading={isLoading}
        isCoordinador={isCoordinador}
        currentUserId={currentUserId}
        obraId={obraId}
        supervisores={supervisores}
        onCreateArea={onCreateArea}
        onUpdateArea={onUpdateArea}
        onDeleteArea={onDeleteArea}
        onViewDetails={onViewAreaDetails}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </div>
  );
};

export default AreaTabsContent;