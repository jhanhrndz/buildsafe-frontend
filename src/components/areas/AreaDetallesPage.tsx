import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AreaDetalles from './AreaDetalles';
import { useArea } from '../../hooks/features/useArea';
import { useUserContext } from '../../context/UserContext';
import type { Area } from '../../types/entities';

const AreaDetallesPage: React.FC = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const numericAreaId = Number(areaId);

  const isCoordinador = user?.global_role === 'coordinador';

  const { getAreaById, update, remove } = useArea();

  const [area, setArea] = useState<Area | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar el área al montar
  useEffect(() => {
    const loadArea = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAreaById(numericAreaId);
        if (data) {
          setArea(data);
        } else {
          setError('Área no encontrada');
        }
      } catch (err) {
        console.error('Error al obtener el área:', err);
        setError('No se pudo cargar el área');
      } finally {
        setLoading(false);
      }
    };

    if (numericAreaId) {
      loadArea();
    }
  }, [numericAreaId, getAreaById]);

  const handleBack = () => navigate(-1);

  const handleEdit = async (areaData: Area) => {
    const success = await update(areaData);
    if (success) {
      const updated = await getAreaById(areaData.id_area);
      if (updated) setArea(updated);
    }
  };

  const handleDelete = async (id: number) => {
    const success = await remove(id);
    if (success) {
      navigate('/obras');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !area) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error al cargar el área</h2>
          <p className="mt-2 text-sm text-red-700">
            {error || 'No se pudo cargar la información del área. Por favor, intenta de nuevo.'}
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
        area={area}
        isCoordinador={isCoordinador}
        onBack={handleBack}
        onEdit={isCoordinador ? handleEdit : undefined}
        onDelete={isCoordinador ? handleDelete : undefined}
      />
    </div>
  );
};

export default AreaDetallesPage;
