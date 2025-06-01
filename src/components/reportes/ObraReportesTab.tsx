import React, { useEffect, useState } from 'react';
import { useReportsContext } from '../../context/ReportsContext';
import ReportList from './ReportList';
import ReportForm from './ReportForm';
import ReportDetail from './ReportDetail';
import ConfirmDialog from '../shared/ConfirmDialog';
import type { ReporteDetail } from '../../types/entities';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
    <div>
      <ReportList
        reportes={reportes}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        error={error}
      />
      {editId && editInitialValues && (
        <ReportForm
          areaId={0}
          camaras={[]} // Puedes pasar [] o buscar la cámara por id si quieres mostrar el select
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
      {toast && (
        <div className={`fixed left-1/2 -translate-x-1/2 bottom-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2
          ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{toast.message}</span>
          <button className="ml-2 text-lg" onClick={() => setToast(null)}>&times;</button>
        </div>
      )}
    </div>
  );
};

export default ObraReportesTab;