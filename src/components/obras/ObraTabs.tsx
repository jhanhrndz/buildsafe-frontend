import { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useParams, useMatch } from 'react-router-dom';
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

type TabType = 'areas' | 'supervisores' | 'reportes' | 'estadisticas';

const ObraTabs = ({ obraId, isCoordinador }: ObraTabsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const match = useMatch('/obras/:id/:tab');

  const {
    areas = [],
    isLoading,
    error,
    create,
    update,
    remove,
  } = useArea(obraId);

  // Determinar la pestaña activa usando react-router's useMatch
  const activeTab = useMemo<TabType>(() => {
    const tabFromUrl = match?.params?.tab;
    const validTabs: TabType[] = ['areas', 'supervisores', 'reportes', 'estadisticas'];
    return validTabs.includes(tabFromUrl as TabType) ? tabFromUrl as TabType : 'areas';
  }, [match]);

  // Configuración de pestañas memoizada
  const tabs = useMemo(() => [
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
      visible: isCoordinador
    },
    {
      id: 'estadisticas' as TabType,
      label: 'Estadísticas',
      icon: <AreaChart size={18} />,
      path: `/obras/${obraId}/estadisticas`,
      visible: isCoordinador
    }
  ], [obraId, isCoordinador]);

  const visibleTabs = useMemo(() => tabs.filter(tab => tab.visible), [tabs]);

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  // Manejo de operaciones de áreas con gestión de errores
  const handleCreateArea = async (areaData: Omit<Area, 'id_area'>) => {
    try {
      await create(areaData);
    } catch (error) {
      console.error('Error creating area:', error);
    }
  };

  const handleUpdateArea = async (areaData: Area) => {
    try {
      await update(areaData);
    } catch (error) {
      console.error('Error updating area:', error);
    }
  };

  const handleDeleteArea = async (areaId: number) => {
    try {
      await remove(areaId);
    } catch (error) {
      console.error('Error deleting area:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Navegación de pestañas */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.path)}
              className={`
                flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
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
            areas={areas}
            isLoading={isLoading}
            error={error}
            onCreateArea={handleCreateArea}
            onUpdateArea={handleUpdateArea}
            onDeleteArea={handleDeleteArea}
          />
        )}

        {activeTab === 'supervisores' && (
          <SupervisoresTab isCoordinador={isCoordinador} />
        )}

        {activeTab === 'reportes' && <ReportesTab />}

        {activeTab === 'estadisticas' && <EstadisticasTab />}
      </div>
    </div>
  );
};

// Componentes auxiliares para cada pestaña
const SupervisoresTab = ({ isCoordinador }: { isCoordinador: boolean }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium text-gray-900">Supervisores Asignados</h2>
      {isCoordinador && (
        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
          + Asignar Supervisor
        </button>
      )}
    </div>
    <PlaceholderContent
      message="No hay supervisores asignados a esta obra."
      actionText="Asignar un supervisor"
      showAction={isCoordinador}
    />
  </div>
);

const ReportesTab = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium text-gray-900">Reportes de Seguridad</h2>
      <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
        + Generar Reporte
      </button>
    </div>
    <PlaceholderContent
      message="No hay reportes generados para esta obra."
      actionText="Generar el primer reporte"
    />
  </div>
);

const EstadisticasTab = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Seguridad</h2>
    <PlaceholderContent
      message="No hay datos estadísticos disponibles para esta obra."
      secondaryMessage="Los datos se mostrarán una vez que haya registros de seguridad."
    />
  </div>
);

const PlaceholderContent = ({
  message,
  secondaryMessage,
  actionText,
  showAction
}: {
  message: string;
  secondaryMessage?: string;
  actionText?: string;
  showAction?: boolean;
}) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center text-gray-500">
    <p>{message}</p>
    {secondaryMessage && <p className="mt-2 text-sm">{secondaryMessage}</p>}
    {showAction && actionText && (
      <button className="mt-4 text-blue-600 hover:text-blue-800">
        {actionText}
      </button>
    )}
  </div>
);

export default ObraTabs;