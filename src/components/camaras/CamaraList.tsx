import React, { useEffect } from 'react';
import { Plus, Camera, AlertCircle } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900">Cámaras del área</h4>
            <p className="text-sm text-gray-600">
              {camaras.length} {camaras.length === 1 ? 'cámara' : 'cámaras'} configuradas
            </p>
          </div>
        </div>
        
        {canEdit && (
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={() => { setEditingCamara(null); setShowForm(true); }}
          >
            <Plus size={18} />
            Nueva cámara
          </button>
        )}
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando cámaras...</p>
          <p className="text-sm text-gray-500">Por favor espera un momento</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-800">Error al cargar las cámaras</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      ) : camaras.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">No hay cámaras configuradas</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            {canEdit 
              ? 'Comienza agregando tu primera cámara de seguridad para esta área.'
              : 'Aún no se han configurado cámaras para esta área.'
            }
          </p>
          {canEdit && (
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 mt-4"
              onClick={() => { setEditingCamara(null); setShowForm(true); }}
            >
              <Plus size={16} />
              Agregar primera cámara
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
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