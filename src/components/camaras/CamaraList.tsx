import React, { useEffect } from 'react';
import { useCamarasContext } from '../../context/CamarasContext';
import { useUserContext } from '../../context/UserContext';
import CamaraCard from './CamaraCard';
import CamaraForm from './CamaraForm';
import type { Area } from '../../types/entities';

interface CamaraListProps {
  area: Area;
}

const CamaraList: React.FC<CamaraListProps> = ({ area }) => {
  const { user } = useUserContext();
  const { camaras, isLoading, error, refresh, createCamara, updateCamara, deleteCamara } = useCamarasContext();
  const [showForm, setShowForm] = React.useState(false);
  const [editingCamara, setEditingCamara] = React.useState<number | null>(null);

  // Cargar cámaras según rol
  useEffect(() => {
    if (user?.global_role === 'coordinador') {
      refresh(area.id_area);
    } else {
      refresh(area.id_area, false); // Puedes cambiar a true si solo quieres activas para supervisor
    }
  }, [area.id_area, user?.global_role, refresh]);

  // CRUD solo para coordinador
  const canEdit = user?.global_role === 'coordinador';

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">Cámaras del área</h4>
        {canEdit && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => { setEditingCamara(null); setShowForm(true); }}
          >
            Nueva cámara
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="text-center py-8">Cargando cámaras...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : camaras.length === 0 ? (
        <div className="text-gray-500 py-8">No hay cámaras en esta área.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {camaras.map(camara => (
            <CamaraCard
              key={camara.id_camara}
              camara={camara}
              canEdit={canEdit}
              onEdit={() => { setEditingCamara(camara.id_camara); setShowForm(true); }}
              onDelete={() => deleteCamara(camara.id_camara)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <CamaraForm
          areaId={area.id_area}
          camaraId={editingCamara}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default CamaraList;