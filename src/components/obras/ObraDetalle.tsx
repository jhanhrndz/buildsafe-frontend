// src/pages/obras/ObraDetalle.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarIcon, InfoIcon, Edit2, Trash2, Building2, Clock } from 'lucide-react';
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
    refresh // Añadir refresh para actualización después de editar
  } = useObra();

  const [obra, setObra] = useState<Obra | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      navigate('/obras', { replace: true }); // Redirección con replace
    } catch (error) {
      console.error('Error eliminando obra:', error);
    }
  };

  // Actualizar datos después de editar
  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    loadObra(); // Recargar datos actualizados
    refresh?.(); // Actualizar lista global si existe
  };

  const getStatusBadge = () => {
    if (!obra) return null;
    const statusConfig = {
      activo: { 
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200', 
        label: 'Activo',
        icon: '●'
      },
      inactivo: { 
        className: 'bg-amber-50 text-amber-700 border border-amber-200', 
        label: 'Inactivo',
        icon: '●'
      },
      finalizado: { 
        className: 'bg-slate-50 text-slate-700 border border-slate-200', 
        label: 'Finalizado',
        icon: '●'
      }
    };
    const config = statusConfig[obra.estado] || statusConfig.activo;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${config.className}`}>
        <span className="text-xs">{config.icon}</span>
        {config.label}
      </div>
    );
  };

  if (isDetailLoading) return <LoadingSpinner />;
  if (detailError) return <ErrorMessage message={detailError} />;
  if (!obra) return <ErrorMessage message="Obra no encontrada" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Header con gradiente sutil */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200/60">
          <div className="absolute inset-0 bg-gradient-to-r"></div>
          <div className="relative p-8">
            {/* Navigation y título */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <button 
                  onClick={() => navigate('/obras')} 
                  className="mr-4 p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-200"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">{obra.nombre}</h1>
                    <p className="text-slate-500 text-sm">ID: {obra.id_obra}</p>
                  </div>
                </div>
              </div>
              
              {isCoordinador && (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsEditModalOpen(true)} 
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    <Edit2 size={16} />
                    <span>Editar</span>
                  </button>
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)} 
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    <Trash2 size={16} />
                    <span>Eliminar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Información principal en cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Descripción */}
              <div className="lg:col-span-2 bg-slate-50/50 rounded-xl p-6 border border-slate-300/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <InfoIcon size={18} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Descripción</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {obra.descripcion || 'Sin descripción disponible'}
                </p>
              </div>

              {/* Estado */}
              <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-300/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock size={18} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Estado</h3>
                </div>
                <div className="flex justify-center">
                  {getStatusBadge()}
                </div>
              </div>

              {/* Fecha de inicio */}
              <div className="lg:col-span-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-6 border border-blue-300/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarIcon size={18} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Fecha de inicio</h3>
                </div>
                <p className="text-slate-700 font-medium text-lg">
                  {obra.fecha_inicio ? formatDate(obra.fecha_inicio) : 'No especificada'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs con mejor estilo */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-300/60 overflow-hidden">
          <ObraTabs obraId={obra.id_obra} isCoordinador={isCoordinador} />
        </div>

        {/* Modales sin cambios */}
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
    </div>
  );
};

export default ObraDetalle;