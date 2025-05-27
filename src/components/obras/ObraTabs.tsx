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
      icon: <Grid3x3 size={18} />,
      path: `/obras/${obraId}`,
      visible: true,
      color: 'blue'
    },
    {
      id: 'supervisores' as TabType,
      label: 'Supervisores',
      icon: <Users size={18} />,
      path: `/obras/${obraId}/supervisores`,
      visible: true,
      color: 'emerald'
    },
    {
      id: 'reportes' as TabType,
      label: 'Reportes',
      icon: <ClipboardList size={18} />,
      path: `/obras/${obraId}/reportes`,
      visible: isCoordinador,
      color: 'orange'
    },
    {
      id: 'estadisticas' as TabType,
      label: 'Estadísticas',
      icon: <AreaChart size={18} />,
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
        active: 'bg-blue-50 text-blue-700 border-blue-200',
        inactive: 'text-gray-600 hover:bg-blue-50 hover:text-blue-600',
        border: 'border-blue-500',
        icon: 'text-blue-600'
      },
      emerald: {
        active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        inactive: 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600',
        border: 'border-emerald-500',
        icon: 'text-emerald-600'
      },
      orange: {
        active: 'bg-orange-50 text-orange-700 border-orange-200',
        inactive: 'text-gray-600 hover:bg-orange-50 hover:text-orange-600',
        border: 'border-orange-500',
        icon: 'text-orange-600'
      },
      purple: {
        active: 'bg-purple-50 text-purple-700 border-purple-200',
        inactive: 'text-gray-600 hover:bg-purple-50 hover:text-purple-600',
        border: 'border-purple-500',
        icon: 'text-purple-600'
      }
    };

    return colorMap[tabColor as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Navegación de pestañas */}
      <div className="relative bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200">
        <nav className="flex overflow-x-auto p-2">
          {visibleTabs.map((tab) => {
            const colors = getTabColors(tab.color, activeTab === tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`
                  group relative flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap
                  rounded-lg mx-1 transition-all duration-300 ease-in-out border
                  ${activeTab === tab.id ? colors.active : `${colors.inactive} border-transparent hover:border-gray-200`}
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span className={`
                  mr-3 transition-all duration-300 group-hover:scale-110
                  ${activeTab === tab.id ? colors.icon : 'text-gray-500 group-hover:text-inherit'}
                `}>
                  {tab.icon}
                </span>
                <span className="font-semibold">{tab.label}</span>
                
                {/* Indicador activo */}
                {activeTab === tab.id && (
                  <div className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2 
                    w-12 h-1 ${colors.border} rounded-full
                    animate-pulse
                  `} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="relative p-8 min-h-[500px] bg-gradient-to-br from-white via-gray-50/30 to-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 pointer-events-none" />
        
        <div className="relative z-10">
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
    </div>
  );
};

// Componentes auxiliares para pestañas
const SupervisoresTab = () => (
  <div className="space-y-8">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
          Supervisores Asignados
        </h2>
        <p className="text-gray-600">Gestiona los supervisores de esta obra</p>
      </div>
      <button className="group flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
        <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
        Asignar Supervisor
      </button>
    </div>
    <PlaceholderContent
      icon={<Users size={64} className="text-emerald-400" />}
      message="No hay supervisores asignados a esta obra"
      secondaryMessage="Asigna supervisores para mejorar el control y seguimiento del proyecto"
      actionText="Asignar primer supervisor"
      bgGradient="from-emerald-50 to-emerald-100/50"
      borderColor="border-emerald-200"
      hoverBorder="hover:border-emerald-300"
      buttonColor="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
    />
  </div>
);

const ReportesTab = () => (
  <div className="space-y-8">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
          Reportes de Seguridad
        </h2>
        <p className="text-gray-600">Genera y consulta reportes detallados</p>
      </div>
      <button className="group flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
        <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
        Generar Reporte
      </button>
    </div>
    <PlaceholderContent
      icon={<ClipboardList size={64} className="text-orange-400" />}
      message="No hay reportes generados para esta obra"
      secondaryMessage="Los reportes te ayudarán a mantener un registro detallado de las actividades"
      actionText="Generar primer reporte"
      bgGradient="from-orange-50 to-orange-100/50"
      borderColor="border-orange-200"
      hoverBorder="hover:border-orange-300"
      buttonColor="bg-orange-100 text-orange-700 hover:bg-orange-200"
    />
  </div>
);

const EstadisticasTab = () => (
  <div className="space-y-8">
    <div className="space-y-2">
      <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
        Estadísticas de Seguridad
      </h2>
      <p className="text-gray-600">Analiza métricas y tendencias del proyecto</p>
    </div>
    <PlaceholderContent
      icon={<AreaChart size={64} className="text-purple-400" />}
      message="No hay datos estadísticos disponibles"
      secondaryMessage="Las estadísticas se generarán automáticamente cuando tengas registros suficientes"
      bgGradient="from-purple-50 to-purple-100/50"
      borderColor="border-purple-200"
      hoverBorder="hover:border-purple-300"
      buttonColor="bg-purple-100 text-purple-700 hover:bg-purple-200"
    />
  </div>
);

const PlaceholderContent = ({
  icon,
  message,
  secondaryMessage,
  actionText,
  bgGradient,
  borderColor,
  hoverBorder,
  buttonColor
}: {
  icon?: React.ReactNode;
  message: string;
  secondaryMessage?: string;
  actionText?: string;
  bgGradient: string;
  borderColor: string;
  hoverBorder: string;
  buttonColor: string;
}) => (
  <div className={`
    bg-gradient-to-br ${bgGradient}
    border-2 border-dashed ${borderColor}
    rounded-2xl p-16 text-center
    transition-all duration-300 ${hoverBorder}
    backdrop-blur-sm
  `}>
    <div className="flex flex-col items-center space-y-6">
      {icon && (
        <div className="p-6 bg-white/70 rounded-full shadow-lg backdrop-blur-sm">
          {icon}
        </div>
      )}
      <div className="space-y-3 max-w-lg">
        <h3 className="text-xl font-bold text-gray-800">{message}</h3>
        {secondaryMessage && (
          <p className="text-gray-600 leading-relaxed">{secondaryMessage}</p>
        )}
      </div>
      {actionText && (
        <button className={`
          px-8 py-3 ${buttonColor} 
          rounded-xl font-semibold transition-all duration-300
          shadow-md hover:shadow-lg transform hover:-translate-y-0.5
        `}>
          {actionText}
        </button>
      )}
    </div>
  </div>
);

export default ObraTabs;