import React, { useEffect, useState } from 'react';
import { useReportsContext } from '../../context/ReportsContext';
import { useCamarasContext } from '../../context/CamarasContext';
import { useUserContext } from '../../context/UserContext';
import ReportList from './ReportList';
import ReportForm from './ReportForm';
import ReportDetail from './ReportDetail';
import ConfirmDialog from '../shared/ConfirmDialog';
import type { ReporteResumen, ReporteDetail } from '../../types/entities';
import { AlertCircle, CheckCircle, FileWarning, Plus, BarChart3, Filter, RefreshCw } from 'lucide-react';

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
            estado: data.estado, // <-- ¡IMPORTANTE!
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

  // Statistics calculations
  const getReportStats = () => {
    const total = reportes.length;
    const pendientes = reportes.filter(r => r.estado === 'pendiente').length;
    const enRevision = reportes.filter(r => r.estado === 'en revisión').length;
    const cerrados = reportes.filter(r => r.estado === 'cerrado').length;
    return { total, pendientes, enRevision, cerrados };
  };

  const stats = getReportStats();

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Reportes</h1>
                <p className="text-slate-600 mt-1">Administra y supervisa los reportes del área</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Plus className="h-4 w-4" />
                Nuevo Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pendientes}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">En Revisión</p>
                <p className="text-2xl font-bold text-blue-600">{stats.enRevision}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Filter className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Cerrados</p>
                <p className="text-2xl font-bold text-green-600">{stats.cerrados}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {!isLoading && (!reportes || reportes.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-full p-6 mb-6 shadow-sm">
                <FileWarning className="h-12 w-12 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">No hay reportes registrados</h3>
              <p className="text-slate-600 mb-8 text-center max-w-md leading-relaxed">
                Aún no se ha registrado ningún reporte de infracción en esta área.
                {user?.global_role === 'coordinador' || user?.global_role === 'supervisor'
                  ? ' ¡Puedes crear el primero ahora!'
                  : ''}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Plus className="h-5 w-5" />
                Crear primer reporte
              </button>
            </div>
          ) : (
            <div className="p-6">
              <ReportList
                reportes={reportes}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
                error={error}
                user={user}
              />
            </div>
          )}
        </div>

        {/* Estado Selector for Coordinador */}
        {editId && user?.global_role === 'coordinador' && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Cambiar Estado del Reporte</h3>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estado actual
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                value={estado}
                onChange={e => setEstado(e.target.value as any)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en revision">En revisión</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          </div>
        )}
      </div>

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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed inset-x-4 bottom-6 z-50 flex justify-center">
          <div className={`
            flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 transform
            ${toast.type === 'success' 
              ? 'bg-green-50/90 text-green-800 border-green-200' 
              : 'bg-red-50/90 text-red-800 border-red-200'
            }
          `}>
            {toast.type === 'success' ? 
              <CheckCircle className="h-5 w-5 text-green-600" /> : 
              <AlertCircle className="h-5 w-5 text-red-600" />
            }
            <span className="font-medium">{toast.message}</span>
            <button 
              className="ml-2 text-xl hover:opacity-70 transition-opacity" 
              onClick={() => setToast(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaReportesTab;