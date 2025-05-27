// src/pages/obras/ObraDetalle.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarIcon, InfoIcon, Edit2, Trash2, Building2, Clock, MoreVertical } from 'lucide-react';
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
    deleteObra,
    isLoading: isObraLoading,
    error: obraError,
    clearError,
    refresh
  } = useObra();

  const [obra, setObra] = useState<Obra | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const isCoordinador = user?.global_role === 'coordinador';

  // Cargar obra con manejo de errores mejorado
  const loadObra = async () => {
    try {
      setIsDetailLoading(true);
      clearError();
      const data = await getObraById(obraId);
      
      if (!data) {
        throw new Error('No se encontró la obra especificada');
      }
      
      setObra(data);
      updateTitle(`Obra: ${data.nombre}`);
      setDetailError(null);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : 'Error al cargar los detalles');
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    if (obraId) loadObra();
  }, [obraId]);

  // Eliminar obra con redirección
  const handleDeleteObra = async () => {
    if (!obraId) return;
    
    try {
      await deleteObra(obraId);
      navigate('/obras', { replace: true });
    } catch (error) {
      console.error('Error eliminando obra:', error);
    }
  };

  // Actualizar datos después de editar
  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    loadObra();
    refresh?.();
  };

  const getStatusConfig = () => {
    if (!obra) return null;
    const statusConfig = {
      activo: { 
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-700',
        ring: 'ring-emerald-500/20',
        dot: 'bg-emerald-500',
        label: 'Activo'
      },
      inactivo: { 
        bg: 'bg-amber-500/10',
        text: 'text-amber-700',
        ring: 'ring-amber-500/20',
        dot: 'bg-amber-500',
        label: 'Inactivo'
      },
      finalizado: { 
        bg: 'bg-gray-500/10',
        text: 'text-gray-700',
        ring: 'ring-gray-500/20',
        dot: 'bg-gray-500',
        label: 'Finalizado'
      }
    };
    return statusConfig[obra.estado] || statusConfig.activo;
  };

  if (isDetailLoading) return <LoadingSpinner />;
  if (detailError) return <ErrorMessage message={detailError} />;
  if (!obra) return <ErrorMessage message="Obra no encontrada" />;

  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => navigate('/obras')} 
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-white hover:text-gray-900 hover:shadow-sm"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Volver a obras</span>
          </button>

          {isCoordinador && (
            <div className="relative">
              <button
                onClick={() => setShowActionMenu(!showActionMenu)}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-md"
              >
                <MoreVertical className="h-4 w-4" />
                <span>Acciones</span>
              </button>
              
              {showActionMenu && (
                <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/5">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setShowActionMenu(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Editar obra</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setShowActionMenu(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar obra</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/50">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20" />
          
          <div className="relative px-8 py-10">
            <div className="flex items-start gap-6">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {obra.nombre}
                  </h1>
                  {statusConfig && (
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.ring}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                      {statusConfig.label}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium">ID:</span>
                  <span className="font-mono">{obra.id_obra}</span>
                </div>

                {obra.fecha_inicio && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Inicio: {formatDate(obra.fecha_inicio)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        {obra.descripcion && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                <InfoIcon className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Descripción</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {obra.descripcion}
            </p>
          </div>
        )}

        {/* Tabs Section */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200/50">
          <ObraTabs obraId={obra.id_obra} isCoordinador={isCoordinador} />
        </div>

        {/* Modals */}
        {isEditModalOpen && (
          <ObraForm 
            onClose={handleEditSuccess}
            obraToEdit={obra}
          />
        )}

        {isDeleteModalOpen && (
          <ConfirmDialog
            title="Eliminar obra"
            message={`¿Confirmas la eliminación permanente de "${obra.nombre}"?`}
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

      {/* Click outside to close menu */}
      {showActionMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActionMenu(false)}
        />
      )}
    </div>
  );
};

export default ObraDetalle;