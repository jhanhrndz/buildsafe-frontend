import React, { useEffect, useState } from 'react';
import { useReportsContext } from '../../context/ReportsContext';
import ReportList from './ReportList';
import ReportDetail from './ReportDetail';
import { useUserContext } from '../../context/UserContext';
import { AlertCircle, CheckCircle, ClipboardList, FileText, BarChart3, User, Shield, TrendingUp, Clock, Star, Construction } from 'lucide-react';
import ReportForm from './ReportForm';

const ReportesGlobalPage: React.FC = () => {
  const { user } = useUserContext();
  const {
    reportes,
    refreshByCoordinador,
    refreshByUsuario,
    isLoading,
    error,
    getById,
    remove,
    updateEstadoReporte,
  } = useReportsContext();

  const [detalle, setDetalle] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editInitialValues, setEditInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    if (user.global_role === 'coordinador') {
      refreshByCoordinador(user.id_usuario);
    } else {
      refreshByUsuario(user.id_usuario);
    }
  }, [user, refreshByCoordinador, refreshByUsuario]);

  const handleView = async (id: number) => {
    const det = await getById(id);
    if (det) setDetalle(det);
  };

  const handleDelete = (id: number) => setDeleteId(id);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const ok = await remove(deleteId);
    if (ok) {
      setToast({ type: 'success', message: 'Reporte eliminado correctamente.' });
      if (user?.global_role === 'coordinador') {
        await refreshByCoordinador(user.id_usuario);
      } else {
        await refreshByUsuario(user?.id_usuario ?? 0);
      }
    } else {
      setToast({ type: 'error', message: 'No se pudo eliminar el reporte.' });
    }
    setDeleteId(null);
  };

  const handleEdit = (id: number) => setEditId(id);

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

  if (!user) return null;

  // Estadísticas rápidas de reportes
  const reportesStats = {
    total: reportes?.length || 0,
    pendientes: reportes?.filter(r => r.estado === 'pendiente').length || 0,
    resueltos: reportes?.filter(r => r.estado === 'cerrado').length || 0,
    enProceso: reportes?.filter(r => r.estado === 'en revisión').length || 0,
  };

  const isCoordinador = user?.global_role === 'coordinador';

  return (
    <div className="flex-1 min-h-screen  to-orange-50/30">

      <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Enhanced Header Section */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-sm border  border-gray-50 relative overflow-hidden">
              {/* Background decoration */}
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-400 shadow-sm shadow-orange-400/25 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <Construction className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-gray-700 tracking-tight bg-clip-text mb-2">
                      {isCoordinador ? 'Centro de Reportes' : 'Mis Reportes'}
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                      {isCoordinador 
                        ? 'Gestiona todos los reportes de seguridad de tus obra'
                        : 'Gestiona y supervisa todos tus reportes de seguridad desde un solo lugar'
                      }
                    </p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Enhanced Stats Cards with improved animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-orange-400/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900 group-hover:text-orange-400 transition-colors duration-300">{reportesStats.total}</p>
                    <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Total Reportes</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-orange-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Gestión integral</span>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-3xl  p-8 shadow-sm hover:shadow-sm hover:shadow-yellow-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">{reportesStats.pendientes}</p>
                    <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Pendientes</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-yellow-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Requieren atención</span>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{reportesStats.enProceso}</p>
                    <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">En Revisión</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-blue-600">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">En progreso</span>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-3xl  p-8 shadow-sm hover:shadow-sm hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900 group-hover:text-green-600 transition-colors duration-300">{reportesStats.resueltos}</p>
                    <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Completados</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Exitosos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Error Alert */}
          {error && (
            <div className="rounded-2xl border border-red-200/50 bg-gradient-to-r from-red-50/80 to-red-100/30 backdrop-blur-sm p-8 shadow-sm transform hover:scale-[1.02] transition-transform duration-300">
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
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-50 overflow-hidden w-full transform hover:shadow-gray-500/10 transition-all duration-500">
            <div className="bg-orange-400 px-8 py-6 relative overflow-hidden">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ClipboardList className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Lista de Reportes</h3>
                    <p className="text-orange-100 text-sm">Gestión completa de incidencias</p>
                  </div>
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
                user={user}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modals and Dialogs */}
      {detalle && (
        <ReportDetail reporte={detalle} onClose={() => setDetalle(null)} />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm p-10 max-w-md w-full transform transition-all duration-300 scale-100 hover:scale-[1.02]">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Eliminar reporte</h3>
                <p className="text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-gray-700 mb-10 text-lg">¿Estás seguro de eliminar este reporte? Se perderá toda la información asociada.</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-8 py-3 rounded-2xl border border-gray-200 bg-white/80 text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200 hover:scale-105"
                onClick={() => setDeleteId(null)}
              >
                Cancelar
              </button>
              <button
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:scale-105"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
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

      {editId && editInitialValues && (
        <ReportForm
          areaId={editInitialValues.id_area}
          camaras={[]}
          isEdit
          reporteId={editId}
          initialValues={editInitialValues}
          onSuccess={() => {
            setEditId(null);
            if (user?.global_role === 'coordinador') {
              refreshByCoordinador(user.id_usuario);
            } else {
              refreshByUsuario(user.id_usuario);
            }
          }}
          onCancel={() => setEditId(null)}
        />
      )}

    </div>
  );
};

export default ReportesGlobalPage;