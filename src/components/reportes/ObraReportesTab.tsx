import React, { useEffect, useState } from 'react';
import { useReportsContext } from '../../context/ReportsContext';
import ReportList from './ReportList';
import ReportForm from './ReportForm';
import ReportDetail from './ReportDetail';
import ConfirmDialog from '../shared/ConfirmDialog';
import type { ReporteDetail } from '../../types/entities';
import { AlertCircle, CheckCircle, ClipboardList, FileText, BarChart3, TrendingUp, Clock, Star, Construction } from 'lucide-react';

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


  console.log('Reportes en contexto:', reportes);

  return (
    <div className="space-y-8 relative">

      {/* Enhanced Header Section */}
      <div className="relative space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-50 relative overflow-hidden">
          {/* Background decoration */}
          
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-400 shadow-sm flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <Construction className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-700 tracking-tight bg-gradient-to-r  bg-clip-text mb-2">
                Reportes de Obra
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl">
                Gestiona y supervisa todos los reportes de seguridad y cumplimiento de la obra
              </p>
            </div>
          </div>
        </div>
        {/* Enhanced Stats Cards */}
        
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

      {/* Enhanced Modals and Dialogs */}
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

export default ObraReportesTab;