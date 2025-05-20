// src/components/areas/AreaDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AreaDetalles from './AreaDetalles';
import { useArea } from '../../hooks/features/useArea';
import { useUserContext } from '../../context/UserContext';

const AreaDetallesPage: React.FC = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const numericAreaId = Number(areaId);
  
  // Usamos useArea sin necesidad de obraId para la obtención directa
  const { getAreaById, updateArea, deleteArea } = useArea();
  const areaQuery = getAreaById(numericAreaId);
  
  const isCoordinador = user?.global_role === 'coordinador';

  // Manejar la navegación de vuelta
  const handleBack = () => {
    navigate(-1); // Volver a la página anterior
  };

  // Manejar la edición del área
  const handleEdit = (areaData: any) => {
    if (updateArea) {
      updateArea.mutate(areaData);
    }
  };

  // Manejar la eliminación del área
  const handleDelete = (areaId: number) => {
    if (deleteArea) {
      deleteArea.mutate(areaId, {
        onSuccess: () => {
          navigate('/obras'); // Navegamos a la lista de obras después de eliminar
        }
      });
    }
  };

  if (areaQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (areaQuery.error || !areaQuery.data) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error al cargar el área</h2>
          <p className="mt-2 text-sm text-red-700">
            No se pudo cargar la información del área. Por favor, intenta de nuevo.
          </p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <AreaDetalles
        area={areaQuery.data}
        isCoordinador={isCoordinador}
        onBack={handleBack}
        onEdit={isCoordinador ? handleEdit : undefined}
        onDelete={isCoordinador ? handleDelete : undefined}
      />
    </div>
  );
};

export default AreaDetallesPage;