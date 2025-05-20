import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Grid3x3,
  Users,
  ClipboardList,
  AreaChart
} from 'lucide-react';
import AreaTabsContent from '../areas/AreaTabContent';
import { useUserContext } from '../../context/UserContext';
import { useArea } from '../../hooks/features/useArea';
import type { Area } from '../../types/entities';

interface ObraTabsProps {
  obraId: number;
  isCoordinador: boolean;
}

// Las pestañas disponibles
type TabType = 'areas' | 'supervisores' | 'reportes' | 'estadisticas';

const ObraTabs = ({ obraId, isCoordinador }: ObraTabsProps) => {
  // Determinar la pestaña activa basado en la URL
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();

  // Obtener las áreas para esta obra
  const {
    areas,
    isLoading,
    error,
    createArea,
    updateArea,
    deleteArea,
  } = useArea(obraId);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    // Extraer la última parte de la URL para determinar la pestaña activa
    const path = location.pathname;
    if (path.includes('/supervisores')) return 'supervisores';
    if (path.includes('/reportes')) return 'reportes';
    if (path.includes('/estadisticas')) return 'estadisticas';
    return 'areas'; // Por defecto
  });

  // Definición de las pestañas
  const tabs = [
    {
      id: 'areas' as TabType,
      label: 'Áreas',
      icon: <Grid3x3 size={18} />,
      path: `/obras/${obraId}`,
      visible: true
    },
    {
      id: 'supervisores' as TabType,
      label: 'Supervisores',
      icon: <Users size={18} />,
      path: `/obras/${obraId}/supervisores`,
      visible: true
    },
    {
      id: 'reportes' as TabType,
      label: 'Reportes',
      icon: <ClipboardList size={18} />,
      path: `/obras/${obraId}/reportes`,
      visible: isCoordinador // Solo visible para coordinadores
    },
    {
      id: 'estadisticas' as TabType,
      label: 'Estadísticas',
      icon: <AreaChart size={18} />,
      path: `/obras/${obraId}/estadisticas`,
      visible: isCoordinador // Solo visible para coordinadores
    }
  ];

  // Filtrar las pestañas según los permisos
  const visibleTabs = tabs.filter(tab => tab.visible);

  // Cambiar a otra pestaña
  const handleTabChange = (tab: TabType, path: string) => {
    setActiveTab(tab);
    navigate(path);
  };

  // Funciones de gestión de áreas
  const handleCreateArea = async (areaData: Omit<Area, 'id_area'>) => {
    await createArea.mutateAsync(areaData);
  };

  const handleUpdateArea = async (areaData: Area) => {
    await updateArea.mutateAsync(areaData);
  };

  const handleDeleteArea = async (areaId: number) => {
    await deleteArea.mutateAsync(areaId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Navegación de pestañas */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id, tab.path)}
              className={`
                flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="p-6">
        {activeTab === 'areas' && (
          <AreaTabsContent
            obraId={obraId}
            isCoordinador={isCoordinador}
            areas={areas || []}
            isLoading={isLoading}
            error={error}
            onCreateArea={handleCreateArea}
            onUpdateArea={handleUpdateArea}
            onDeleteArea={handleDeleteArea}
          />
        )}

        {activeTab === 'supervisores' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Supervisores Asignados</h2>
              {isCoordinador && (
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                  + Asignar Supervisor
                </button>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center text-gray-500">
              {/* Este es un espacio de contenido temporal - se reemplazaría con tu componente real de supervisores */}
              <p>No hay supervisores asignados a esta obra.</p>
              {isCoordinador && (
                <button className="mt-2 text-blue-600 hover:text-blue-800">
                  Asignar un supervisor
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reportes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Reportes de Seguridad</h2>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                + Generar Reporte
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center text-gray-500">
              {/* Este es un espacio de contenido temporal - se reemplazaría con tu componente real de reportes */}
              <p>No hay reportes generados para esta obra.</p>
              <button className="mt-2 text-blue-600 hover:text-blue-800">
                Generar el primer reporte
              </button>
            </div>
          </div>
        )}

        {activeTab === 'estadisticas' && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Seguridad</h2>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center text-gray-500">
              {/* Este es un espacio de contenido temporal - se reemplazaría con tu componente real de estadísticas */}
              <p>No hay datos estadísticos disponibles para esta obra.</p>
              <p className="mt-2 text-sm">
                Los datos se mostrarán una vez que haya registros de seguridad.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObraTabs;