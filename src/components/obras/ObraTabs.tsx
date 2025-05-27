import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import { Grid3x3, Users, ClipboardList, AreaChart, Plus } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import { useArea } from '../../hooks/features/useArea';
import AreaTabsContent from '../areas/AreaTabContent';
import type { Area } from '../../types/entities';

interface ObraTabsProps {
  obraId: number;
  isCoordinador: boolean;
}

type TabType = 'areas' | 'supervisores' | 'reportes' | 'estadisticas';

const ObraTabs = ({ obraId, isCoordinador }: ObraTabsProps) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const match = useMatch('/obras/:id/:tab');
  
  const {
    areas = [],
    isLoading,
    error,
    createArea,
    updateArea,
    deleteArea,
    refresh
  } = useArea();

  // Referencia para trackear última obra cargada y evitar loops
  const lastLoadedObraId = useRef<number | null>(null);

  // Función de carga memoizada
  const loadAreas = useCallback(async () => {
    if (obraId && obraId !== lastLoadedObraId.current) {
      try {
        await refresh(obraId);
        lastLoadedObraId.current = obraId;
      } catch (error) {
        console.error('Error cargando áreas:', error);
      }
    }
  }, [obraId, refresh]);

  // Determinar pestaña activa
  const activeTab = useMemo<TabType>(() => {
    const tabFromUrl = match?.params?.tab;
    const validTabs: TabType[] = ['areas', 'supervisores', 'reportes', 'estadisticas'];
    return validTabs.includes(tabFromUrl as TabType) ? tabFromUrl as TabType : 'areas';
  }, [match]);

  // Cargar áreas cuando:
  // - Cambia la obra
  // - Se entra a la pestaña de áreas
  useEffect(() => {
    if (activeTab === 'areas') {
      loadAreas();
    }
  }, [activeTab, loadAreas]);

  // Configuración de pestañas
  const tabs = useMemo(() => [
    {
      id: 'areas' as TabType,
      label: 'Áreas',
      icon: <Grid3x3 className="h-5 w-5" />,
      path: `/obras/${obraId}`,
      visible: true,
      color: 'blue'
    },
    {
      id: 'supervisores' as TabType,
      label: 'Supervisores',
      icon: <Users className="h-5 w-5" />,
      path: `/obras/${obraId}/supervisores`,
      visible: true,
      color: 'emerald'
    },
    {
      id: 'reportes' as TabType,
      label: 'Reportes',
      icon: <ClipboardList className="h-5 w-5" />,
      path: `/obras/${obraId}/reportes`,
      visible: isCoordinador,
      color: 'orange'
    },
    {
      id: 'estadisticas' as TabType,
      label: 'Estadísticas',
      icon: <AreaChart className="h-5 w-5" />,
      path: `/obras/${obraId}/estadisticas`,
      visible: isCoordinador,
      color: 'purple'
    }
  ], [obraId, isCoordinador]);

  const visibleTabs = useMemo(() => tabs.filter(tab => tab.visible), [tabs]);

  // Handlers para operaciones CRUD
  const handleCreateArea = async (areaData: Omit<Area, 'id_area'>): Promise<boolean> => {
    try {
      if (!createArea) return false;
      return await createArea(areaData);
    } catch (error) {
      console.error('Error creating area:', error);
      return false;
    }
  };

  const handleUpdateArea = async (areaData: Area): Promise<boolean> => {
    try {
      if (!updateArea) return false;
      return await updateArea(areaData);
    } catch (error) {
      console.error('Error updating area:', error);
      return false;
    }
  };

  const handleDeleteArea = async (areaId: number): Promise<boolean> => {
    try {
      if (!deleteArea) return false;
      return await deleteArea(areaId);
    } catch (error) {
      console.error('Error deleting area:', error);
      return false;
    }
  };

  const getTabColors = (tabColor: string, isActive: boolean) => {
    const colorMap = {
      blue: {
        active: 'bg-blue-600 text-white shadow-blue-500/25',
        inactive: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
        accent: 'text-blue-600'
      },
      emerald: {
        active: 'bg-emerald-600 text-white shadow-emerald-500/25',
        inactive: 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50',
        accent: 'text-emerald-600'
      },
      orange: {
        active: 'bg-orange-600 text-white shadow-orange-500/25',
        inactive: 'text-gray-600 hover:text-orange-600 hover:bg-orange-50',
        accent: 'text-orange-600'
      },
      purple: {
        active: 'bg-purple-600 text-white shadow-purple-500/25',
        inactive: 'text-gray-600 hover:text-purple-600 hover:bg-purple-50',
        accent: 'text-purple-600'
      }
    };

    return colorMap[tabColor as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="overflow-hidden">
      {/* Navegación de pestañas */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex space-x-1 p-1" aria-label="Tabs">
          {visibleTabs.map((tab) => {
            const colors = getTabColors(tab.color, activeTab === tab.id);
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`
                  group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${isActive 
                    ? `${colors.active} shadow-lg` 
                    : `${colors.inactive} hover:shadow-sm`
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={`transition-colors duration-200 ${isActive ? 'text-white' : colors.accent}`}>
                  {tab.icon}
                </span>
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="bg-gray-50/30 p-8">
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

        {activeTab === 'supervisores' && <SupervisoresTab />}
        {activeTab === 'reportes' && <ReportesTab />}
        {activeTab === 'estadisticas' && <EstadisticasTab />}
      </div>
    </div>
  );
};

// Componentes auxiliares para pestañas
const SupervisoresTab = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Supervisores</h2>
        <p className="mt-1 text-sm text-gray-600">Gestiona los supervisores asignados a esta obra</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md">
        <Plus className="h-4 w-4" />
        Asignar Supervisor
      </button>
    </div>
    
    <EmptyState
      icon={<Users className="h-12 w-12 text-emerald-400" />}
      title="No hay supervisores asignados"
      description="Asigna supervisores para mejorar el control y seguimiento del proyecto"
      actionText="Asignar primer supervisor"
      colorScheme="emerald"
    />
  </div>
);

const ReportesTab = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
        <p className="mt-1 text-sm text-gray-600">Genera y consulta reportes detallados de seguridad</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange-700 hover:shadow-md">
        <Plus className="h-4 w-4" />
        Generar Reporte
      </button>
    </div>
    
    <EmptyState
      icon={<ClipboardList className="h-12 w-12 text-orange-400" />}
      title="No hay reportes generados"
      description="Los reportes te ayudarán a mantener un registro detallado de las actividades"
      actionText="Generar primer reporte"
      colorScheme="orange"
    />
  </div>
);

const EstadisticasTab = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Estadísticas</h2>
      <p className="mt-1 text-sm text-gray-600">Analiza métricas y tendencias del proyecto</p>
    </div>
    
    <EmptyState
      icon={<AreaChart className="h-12 w-12 text-purple-400" />}
      title="No hay datos estadísticos disponibles"
      description="Las estadísticas se generarán automáticamente cuando tengas registros suficientes"
      colorScheme="purple"
    />
  </div>
);

const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  colorScheme = 'gray'
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  colorScheme?: 'emerald' | 'orange' | 'purple' | 'gray';
}) => {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      button: 'bg-orange-600 hover:bg-orange-700 text-white'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700 text-white'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      button: 'bg-gray-600 hover:bg-gray-700 text-white'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className={`rounded-xl border-2 border-dashed p-12 text-center ${colors.bg} ${colors.border}`}>
      <div className="mx-auto flex flex-col items-center">
        <div className="rounded-full bg-white p-3 shadow-sm">
          {icon}
        </div>
        <h3 className="mt-6 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 max-w-sm">{description}</p>
        {actionText && (
          <button className={`mt-6 rounded-lg px-6 py-2.5 text-sm font-medium shadow-sm transition-all ${colors.button}`}>
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ObraTabs;