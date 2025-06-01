  import React, { useEffect, useState } from 'react';
  import { useReportsContext } from '../../context/ReportsContext';
  import ReportList from './ReportList';
  import ReportDetail from './ReportDetail';
  import { useUserContext } from '../../context/UserContext';
  import { AlertCircle, CheckCircle } from 'lucide-react';
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
              id_area: data.id_area, // <-- AGREGA ESTA LÍNEA
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

    if (!user) return null; // <-- Early return si no hay usuario

    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">
          {user?.global_role === 'coordinador' ? 'Todos los reportes de mis obras' : 'Mis reportes'}
        </h1>
        <ReportList
          reportes={reportes}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          error={error}
          user={user}
        />
        {detalle && (
          <ReportDetail reporte={detalle} onClose={() => setDetalle(null)} />
        )}
        {deleteId && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Eliminar reporte</h3>
              <p>¿Estás seguro de eliminar este reporte? Esta acción no se puede deshacer.</p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setDeleteId(null)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                  onClick={handleConfirmDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
        {toast && (
          <div className={`fixed left-1/2 -translate-x-1/2 bottom-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2
            ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
            <button className="ml-2 text-lg" onClick={() => setToast(null)}>&times;</button>
          </div>
        )}
        {editId && editInitialValues && (
          <ReportForm
            areaId={editInitialValues.id_area}
            camaras={[]} // Puedes buscar las cámaras si quieres
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