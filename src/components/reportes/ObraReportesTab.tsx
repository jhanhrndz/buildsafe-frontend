import React, { useEffect, useState } from 'react';
import { useReportsContext } from '../../context/ReportsContext';
import ReportList from './ReportList';
import ReportForm from './ReportForm';
import ReportDetail from './ReportDetail';
import ConfirmDialog from '../shared/ConfirmDialog';
import type { ReporteDetail } from '../../types/entities';
import { AlertCircle, CheckCircle, ClipboardList, FileText, BarChart3 } from 'lucide-react';

interface ObraReportesTabProps {
  obraId: number;
}

const ObraReportesTab: React.FC<ObraReportesTabProps> = ({ obraId }) => {
  const { reportes, refreshByObra, isLoading, error, getById, remove } = useReportsContext();
  const [editId, setEditId] = useState<number | null>(null);
  const [editInitialValues, setEditInitialValues] = useState<any>(null);
  const [detalle, setDetalle] = useState<ReporteDetail | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { refreshByObra(obraId); }, [obraId, refreshByObra]);

  useEffect(() => {
    if (editId) {
      getById(editId).then((data) => {
        if (data) {
          setEditInitialValues({
            id_area: data.id_area,
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
      refreshByObra(obraId);
    } else {
      setToast({ type: 'error', message: 'No se pudo eliminar el reporte.' });
    }
    setDeleteId(null);
  };

  // Estadísticas rápidas de reportes
  const reportesStats = {
    total: reportes?.length || 0,
    pendientes: reportes?.filter(r => r.estado === 'pendiente').length || 0,
    resueltos: reportes?.filter(r => r.estado === 'cerrado').length || 0,
    enProceso: reportes?.filter(r => r.estado === 'en revisión').length || 0,
  };

  console.log('Reportes en contexto:', reportes);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Reportes de Obra</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            Gestiona y supervisa todos los reportes de seguridad y cumplimiento de la obra
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reportesStats.total}</p>
                <p className="text-sm text-gray-600 font-medium">Total Reportes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center shadow-sm">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reportesStats.pendientes}</p>
                <p className="text-sm text-gray-600 font-medium">Pendientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reportesStats.enProceso}</p>
                <p className="text-sm text-gray-600 font-medium">En Revisión</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:shadow-green-500/10 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reportesStats.resueltos}</p>
                <p className="text-sm text-gray-600 font-medium">Cerrados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100/50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
              <AlertCircle className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error al cargar reportes</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reports Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200 px-8 py-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-orange-600" />
            <h3 className="text-xl font-bold text-orange-900">Lista de Reportes</h3>
          </div>
        </div>

        <div className="p-2">
          <ReportList
            reportes={reportes}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>

      {/* Modals and Dialogs */}
      {editId && editInitialValues && (
        <ReportForm
          areaId={0}
          camaras={[]}
          isEdit
          reporteId={editId}
          initialValues={editInitialValues}
          onSuccess={() => {
            setEditId(null);
            refreshByObra(obraId);
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

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 max-w-md w-full mx-4">
          <div 
            className={`rounded-2xl shadow-2xl border backdrop-blur-sm flex items-center gap-3 p-6 transform transition-all duration-300 ${
              toast.type === 'success' 
                ? 'bg-green-50/90 border-green-200 text-green-800' 
                : 'bg-red-50/90 border-red-200 text-red-800'
            }`}
            style={{ animation: 'toastSlideIn 0.3s ease-out' }}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
              toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {toast.type === 'success' ? 
                <CheckCircle className="w-5 h-5 text-green-600" /> : 
                <AlertCircle className="w-5 h-5 text-red-600" />
              }
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{toast.message}</p>
            </div>
            <button 
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 ${
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

      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ObraReportesTab;