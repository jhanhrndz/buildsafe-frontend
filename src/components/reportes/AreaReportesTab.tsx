import React, { useEffect, useState } from 'react';
import { useReportsContext } from '../../context/ReportsContext';
import { useCamarasContext } from '../../context/CamarasContext';
import { useUserContext } from '../../context/UserContext';
import ReportList from './ReportList';
import ReportForm from './ReportForm';
import ReportDetail from './ReportDetail';
import ConfirmDialog from '../shared/ConfirmDialog';
import type { ReporteResumen, ReporteDetail } from '../../types/entities';
import { AlertCircle, CheckCircle, FileWarning, Plus, BarChart3, Filter, RefreshCw, FileText, TrendingUp, Clock, Star, ClipboardList } from 'lucide-react';

interface AreaReportesTabProps {
  areaId: number;
}

const AreaReportesTab: React.FC<AreaReportesTabProps> = ({ areaId }) => {
  const { reportes, refreshByArea, isLoading, error, getById, remove, updateEstadoReporte } = useReportsContext();
  const { camaras } = useCamarasContext();
  const { user } = useUserContext();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editInitialValues, setEditInitialValues] = useState<any>(null);
  const [detalle, setDetalle] = useState<ReporteDetail | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [estado, setEstado] = useState<'pendiente' | 'en revision' | 'cerrado'>('pendiente');

  useEffect(() => {
    refreshByArea(areaId);
  }, [areaId, refreshByArea]);

  // Cargar valores iniciales para edición
  useEffect(() => {
    if (editId) {
      getById(editId).then((data) => {
        if (data) {
          setEditInitialValues({
            descripcion: data.descripcion,
            id_camara: data.id_camara ?? '',
            selectedEpp: data.infracciones?.map((i) => i.id_epp) || [],
            imagen_url: data.imagen_url,
            estado: data.estado,
          });
        }
      });
    } else {
      setEditInitialValues(null);
    }
  }, [editId, getById]);

  const handleView = async (id: number) => {
    const det = await getById(id);
    if (det) setDetalle(det);
  };

  const handleEdit = (id: number) => setEditId(id);

  const handleDelete = (id: number) => setDeleteId(id);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const ok = await remove(deleteId);
    if (ok) {
      setToast({ type: 'success', message: 'Reporte eliminado correctamente.' });
      refreshByArea(areaId);
    } else {
      setToast({ type: 'error', message: 'No se pudo eliminar el reporte.' });
    }
    setDeleteId(null);
  };



  return (
    <div className="space-y-8 relative">
      {/* Enhanced Header Section */}
      <div className="relative space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-50 relative overflow-hidden">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-400 shadow-sm flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-orange-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  Gestión de Reportes
                </h2>
                <p className="text-gray-600 leading-relaxed max-w-2xl">
                  Administra y supervisa todos los reportes de seguridad del área
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Plus className="h-5 w-5" />
                  Nuevo Reporte
                </div>
              </button>
            </div>
          </div>
        </div>

       
      </div>

      {/* Enhanced Error Alert */}
      {error && (
        <div className="relative rounded-2xl border border-red-200/50 bg-gradient-to-r from-red-50/80 to-red-100/30 backdrop-blur-sm p-8 shadow-sm transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 mb-2 text-lg">Error al cargar reportes</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Reports Section */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500">
        <div className="bg-gradient-to-r from-orange-400 to-orange-400 border-b border-orange-300 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-700/20"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Lista de Reportes</h3>
              <p className="text-orange-100 text-sm">Gestión completa de incidencias</p>
            </div>
          </div>
        </div>

        <div>
          {!isLoading && (!reportes || reportes.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm mb-8 transform hover:scale-105 transition-transform duration-300">
                  <FileWarning className="h-16 w-16 text-orange-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-400 rounded-full shadow-lg animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">No hay reportes registrados</h3>
              <p className="text-gray-600 mb-8 text-center max-w-md leading-relaxed">
                Aún no se ha registrado ningún reporte de infracción en esta área.
                {user?.global_role === 'coordinador' || user?.global_role === 'supervisor'
                  ? ' ¡Puedes crear el primero ahora!'
                  : ''}
              </p>
              {(user?.global_role === 'coordinador' || user?.global_role === 'supervisor') && (
                <button
                  onClick={() => setShowForm(true)}
                  className="group relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-400 hover:from-orange-400 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-bold shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Plus className="h-5 w-5" />
                    Crear primer reporte
                  </div>
                </button>
              )}
            </div>
          ) : (
            <ReportList
              reportes={reportes}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              error={error}
              user={user}
            />
          )}
        </div>
      </div>

      {/* Enhanced Estado Selector for Coordinador */}
      {editId && user?.global_role === 'coordinador' && (
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-700/20"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Filter className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Cambiar Estado del Reporte</h3>
                <p className="text-blue-100 text-sm">Actualizar el estado de seguimiento</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="max-w-xs">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Estado actual
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none border-2 border-gray-200 rounded-2xl px-6 py-4 bg-white text-gray-900 focus:ring-4 focus:ring-orange-400/20 focus:border-orange-400 transition-all duration-300 font-semibold shadow-lg"
                  value={estado}
                  onChange={e => setEstado(e.target.value as any)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en revision">En revisión</option>
                  <option value="cerrado">Cerrado</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forms and Modals */}
      {showForm && (
        <ReportForm
          areaId={areaId}
          camaras={camaras.filter((c) => c.id_area === areaId)}
          onSuccess={() => {
            setShowForm(false);
            refreshByArea(areaId);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      {editId && editInitialValues && (
        <ReportForm
          areaId={areaId}
          camaras={camaras.filter((c) => c.id_area === areaId)}
          isEdit
          reporteId={editId}
          initialValues={editInitialValues}
          onSuccess={() => {
            setEditId(null);
            refreshByArea(areaId);
          }}
          onCancel={() => setEditId(null)}
        />
      )}
      
      {detalle && (
        <ReportDetail reporte={detalle} onClose={() => setDetalle(null)} />
      )}
      
      {deleteId && (
        <ConfirmDialog
          title="Eliminar reporte"
          message="¿Estás seguro de eliminar este reporte? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Enhanced Toast Notifications */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 max-w-md w-full mx-4">
          <div 
            className={`rounded-2xl shadow-sm border backdrop-blur-md flex items-center gap-4 p-6 transform transition-all duration-500 ${
              toast.type === 'success' 
                ? 'bg-green-50/90 border-green-200/50 text-green-800' 
                : 'bg-red-50/90 border-red-200/50 text-red-800'
            }`}
            style={{ animation: 'toastSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              toast.type === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {toast.type === 'success' ? 
                <CheckCircle className="w-6 h-6 text-white" /> : 
                <AlertCircle className="w-6 h-6 text-white" />
              }
            </div>
            <div className="flex-1">
              <p className="font-semibold">{toast.message}</p>
            </div>
            <button 
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-200 hover:scale-110 ${
                toast.type === 'success' 
                  ? 'hover:bg-green-100 text-green-600' 
                  : 'hover:bg-red-100 text-red-600'
              }`}
              onClick={() => setToast(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaReportesTab;