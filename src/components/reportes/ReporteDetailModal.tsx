import { useEffect, useState } from 'react';
import { useReportesContext } from '../../context/ReportesContext';
import type { ReporteDetail } from '../../types/entities';
import ReporteEditModal from './ReporteEditModal';
import { useUserContext } from '../../context/UserContext';

interface Props {
  id: number;
  onClose: () => void;
}

const ReporteDetailModal: React.FC<Props> = ({ id, onClose }) => {
  const { getById } = useReportesContext();
  const [detalle, setDetalle] = useState<ReporteDetail | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const { user } = useUserContext();

  useEffect(() => {
    getById(id).then(det => setDetalle(det ?? null));
  }, [id, getById]);

  if (!detalle) return <div className="p-8">Cargando detalle...</div>;

  // Solo el creador o el coordinador puede editar
  const canEdit = user?.global_role === 'coordinador' || user?.id_usuario === detalle.id_usuario;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
          <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
          <h2 className="text-xl font-bold mb-2">{detalle.descripcion}</h2>
          <div className="mb-2 text-sm text-gray-500">{detalle.nombre_area} - {detalle.nombre_obra}</div>
          <div className="mb-2 text-xs text-gray-400">{new Date(detalle.fecha_hora).toLocaleString()}</div>
          {detalle.imagen_url && (
            <img src={detalle.imagen_url} alt="Evidencia" className="mb-4 rounded shadow" />
          )}
          <div className="mb-2">
            <span className="font-semibold">Estado:</span> {detalle.estado}
          </div>
          {detalle.infracciones && detalle.infracciones.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Infracciones:</span>
              <ul className="list-disc ml-6">
                {detalle.infracciones.map((inf, idx) => (
                  <li key={idx}>{inf.nombre} ({inf.categoria_epp})</li>
                ))}
              </ul>
            </div>
          )}
          {canEdit && (
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowEdit(true)}
            >
              Editar reporte
            </button>
          )}
        </div>
      </div>
      {showEdit && (
        <ReporteEditModal id={id} onClose={() => { setShowEdit(false); onClose(); }} />
      )}
    </>
  );
};

export default ReporteDetailModal;