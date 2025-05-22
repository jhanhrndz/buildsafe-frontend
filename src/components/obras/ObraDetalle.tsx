// src/pages/obras/ObraDetalle.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarIcon, InfoIcon, Edit2, Trash2 } from 'lucide-react';
import { useDashboardContext } from '../../components/dashboard/DashboardLayout';
import { useObra } from '../../hooks/features/useObra';
import { useUserContext } from '../../context/UserContext';
import ObraTabs from '../../components/obras/ObraTabs';
import ObraForm from '../../components/obras/ObraForm';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { formatDate } from '../../utils/formatters';
import type { Obra } from '../../types/entities';

const ObraDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const obraId = id ? parseInt(id, 10) : 0;

  const { updateTitle } = useDashboardContext();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const {
    getObraById,
    remove,
    isLoading: isObraLoading,
    error: obraError,
    clearError
  } = useObra();

  const [obra, setObra] = useState<Obra | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isCoordinador = user?.global_role === 'coordinador';

  // Cargar obra al montar el componente
  useEffect(() => {
    const loadObra = async () => {
      try {
        const obraData = await getObraById(obraId);
        if (obraData) {
          setObra(obraData);
          updateTitle(`Obra: ${obraData.nombre}`);
        } else {
          setError('No se encontró la obra especificada');
        }
      } catch (err) {
        setError('Error al cargar los detalles de la obra');
      } finally {
        setIsLoading(false);
      }
    };

    if (obraId) loadObra();
  }, [obraId, getObraById, updateTitle]);

  // Manejar eliminación
  const handleDeleteObra = async () => {
    if (!obraId) return;
    
    try {
      await remove(obraId);
      setIsDeleteModalOpen(false);
      navigate('/obras');
    } catch (error) {
      // El error ya está manejado por el hook
    }
  };

  // Determinar estado
  const getStatusBadge = () => {
    if (!obra) return null;
    
    const statusConfig = {
      activo: { className: 'bg-green-100 text-green-800', label: 'Activo' },
      inactivo: { className: 'bg-yellow-100 text-yellow-800', label: 'Inactivo' },
      finalizado: { className: 'bg-gray-100 text-gray-800', label: 'Finalizado' }
    };
    
    const config = statusConfig[obra.estado] || statusConfig.activo;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!obra) return <ErrorMessage message="No se encontró la obra especificada" />;

  return (
    <div className="space-y-6">
      {/* Cabecera con información de la obra */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate('/obras')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 flex-1">{obra.nombre}</h1>
          
          {isCoordinador && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Edit2 size={16} />
                <span>Editar</span>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash2 size={16} />
                <span>Eliminar</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div>
            <div className="flex items-start gap-2 mb-3">
              <InfoIcon size={18} className="text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-700">Descripción</h3>
                <p className="text-gray-600 mt-1">{obra.descripcion || 'Sin descripción'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CalendarIcon size={18} className="text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-700">Fecha de inicio</h3>
                <p className="text-gray-600 mt-1">
                  {obra.fecha_inicio ? formatDate(obra.fecha_inicio) : 'No especificada'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Columna derecha */}
          <div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Estado</h3>
              <div className="flex items-center">
                {getStatusBadge()}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ObraTabs obraId={obra.id_obra} isCoordinador={isCoordinador} />
      
      {isEditModalOpen && (
        <ObraForm
          onClose={() => setIsEditModalOpen(false)}
          obraToEdit={obra}
        />
      )}
      
      {isDeleteModalOpen && (
        <ConfirmDialog
          title="Eliminar obra"
          message={`¿Estás seguro que deseas eliminar la obra "${obra.nombre}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          isLoading={isObraLoading}
          onConfirm={handleDeleteObra}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            clearError();
          }}
          variant="danger"
        />
      )}
    </div>
  );
};

export default ObraDetalle;