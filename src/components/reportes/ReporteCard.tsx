import type { ReporteResumen } from '../../types/entities';
import { useState } from 'react';
import ReporteDetailModal from './ReporteDetailModal';
import ReporteEditModal from './ReporteEditModal'; // Importa el modal de edición
import { Edit2 } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';

interface Props {
  reporte: ReporteResumen;
}

const ReporteCard: React.FC<Props> = ({ reporte }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { user } = useUserContext();

  // Solo el creador o el coordinador puede editar (ajusta según tu lógica de permisos)
  const canEdit = user?.global_role === 'coordinador' || user?.id_usuario === reporte.id_usuario;

  return (
    <>
      <div
        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:ring-2 hover:ring-blue-400 transition relative"
        onClick={() => setShowDetail(true)}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold">{reporte.descripcion}</div>
            <div className="text-xs text-gray-500">{reporte.nombre_area} - {reporte.nombre_obra}</div>
            <div className="text-xs text-gray-400">{new Date(reporte.fecha_hora).toLocaleString()}</div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold ${reporte.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : reporte.estado === 'en_revision' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
            {reporte.estado}
          </span>
        </div>
        {canEdit && (
          <button
            className="absolute top-2 right-2 p-1 rounded hover:bg-blue-50"
            onClick={e => {
              e.stopPropagation();
              setShowEdit(true);
            }}
            title="Editar reporte"
          >
            <Edit2 size={18} className="text-blue-600" />
          </button>
        )}
      </div>
      {showDetail && (
        <ReporteDetailModal id={reporte.id_reporte} onClose={() => setShowDetail(false)} />
      )}
      {showEdit && (
        <ReporteEditModal id={reporte.id_reporte} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
};

export default ReporteCard;