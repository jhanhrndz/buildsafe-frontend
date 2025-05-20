// src/components/areas/AreasModule.tsx
import React, { useState, useEffect } from 'react';
import AreaList from './AreaList';
import AreaDetalles from './AreaDetalles';
import { useUserContext } from '../../context/UserContext';
import type { Area, User } from '../../types/entities';

// Este es un componente contenedor que maneja todo el módulo de áreas
interface AreasModuleProps {
  obraId: number;
  areas: Area[];
  isLoading: boolean;
  error: Error | null;
  supervisores?: User[];
  onCreateArea?: (areaData: Omit<Area, 'id_area'>) => Promise<void>;
  onUpdateArea?: (areaData: Area) => Promise<void>;
  onDeleteArea?: (areaId: number) => Promise<void>;
}

const AreasModule: React.FC<AreasModuleProps> = ({
  obraId,
  areas,
  isLoading,
  error,
  supervisores = [],
  onCreateArea,
  onUpdateArea,
  onDeleteArea
}) => {
  const { user } = useUserContext();
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  
  const isCoordinador = user?.global_role === 'coordinador';
  
  // Buscar el área seleccionada cuando cambia el ID o las áreas
  useEffect(() => {
    if (selectedAreaId && areas) {
      const area = areas.find(a => a.id_area === selectedAreaId) || null;
      setSelectedArea(area);
    } else {
      setSelectedArea(null);
    }
  }, [selectedAreaId, areas]);
  
  // Para supervisores: Si solo tienen un área asignada, mostrar directamente esa área
  useEffect(() => {
    if (!isCoordinador && user && areas && areas.length > 0) {
      // Filtrar áreas asignadas al supervisor actual
      const supervisorAreas = areas.filter(area => area.id_supervisor === user.id_usuario);
      
      // Si solo hay un área asignada, seleccionarla automáticamente
      if (supervisorAreas.length === 1) {
        setSelectedAreaId(supervisorAreas[0].id_area);
      }
    }
  }, [isCoordinador, user, areas]);
  
  const handleViewAreaDetails = (areaId: number) => {
    setSelectedAreaId(areaId);
  };
  
  const handleBackToList = () => {
    setSelectedAreaId(null);
    setSelectedArea(null);
    setIsEditModalOpen(false);
  };
  
  const handleEditArea = (area: Area) => {
    if (onUpdateArea) {
      setSelectedArea(area);
      setIsEditModalOpen(true);
    }
  };
  
  const handleDeleteArea = async (areaId: number) => {
    if (onDeleteArea) {
      try {
        await onDeleteArea(areaId);
        // Si estábamos viendo el área que se eliminó, volvemos a la lista
        if (selectedAreaId === areaId) {
          handleBackToList();
        }
      } catch (error) {
        console.error("Error al eliminar el área:", error);
        // Aquí podrías mostrar una notificación de error
      }
    }
  };
  
  // Si se ha seleccionado un área, mostrar los detalles
  if (selectedArea) {
    return (
      <AreaDetalles
        area={selectedArea}
        isCoordinador={isCoordinador}
        onBack={handleBackToList}
        onEdit={isCoordinador ? handleEditArea : undefined}
        onDelete={isCoordinador ? handleDeleteArea : undefined}
      />
    );
  }
  
  // De lo contrario, mostrar la lista de áreas
  return (
    <AreaList
      areas={areas}
      isLoading={isLoading}
      isCoordinador={isCoordinador}
      currentUserId={user?.id_usuario}
      obraId={obraId}
      supervisores={supervisores}
      onCreateArea={onCreateArea}
      onUpdateArea={onUpdateArea}
      onDeleteArea={handleDeleteArea}
      onViewDetails={handleViewAreaDetails}
    />
  );
};

export default AreasModule;