import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import { Grid3x3, Users, ClipboardList, AreaChart, Plus } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import { useArea } from '../../hooks/features/useArea';
import AreaTabsContent from '../areas/AreaTabContent';
import SupervisoresTab from '../supervisores/SupervisoresTab';
import ObraReportesTab from '../reportes/ObraReportesTab';
import { obraUsuarioService } from '../../services/obraUsuario'; // <-- IMPORTANTE
import { useReportsContext } from '../../context/ReportsContext';
import type { Area, SupervisorWithAreas, User } from '../../types/entities';

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

  const { refreshByObra } = useReportsContext();

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

  // Refrescar reportes al cambiar obraId
  useEffect(() => {
    if (obraId) {
      refreshByObra(obraId);
    }
  }, [obraId, refreshByObra]);

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
        active: 'bg-orange-500 text-white shadow-orange-500/25',
        inactive: 'text-gray-600 hover:text-orange-400 hover:bg-orange-50',
        accent: 'text-orange-500'
      },
      purple: {
        active: 'bg-purple-600 text-white shadow-purple-500/25',
        inactive: 'text-gray-600 hover:text-purple-600 hover:bg-purple-50',
        accent: 'text-purple-600'
      }
    };

    return colorMap[tabColor as keyof typeof colorMap] || colorMap.blue;
  };

  // Estado para supervisores
  const [supervisores, setSupervisores] = useState<SupervisorWithAreas[]>([]);
  const [loadingSupervisores, setLoadingSupervisores] = useState(false);
  const lastLoadedObraIdSupervisores = useRef<number | null>(null);

  // Cargar supervisores cuando cambia obraId o cuando entras al tab de áreas
  useEffect(() => {
    if (activeTab === 'areas' && obraId) {
      setLoadingSupervisores(true);
      obraUsuarioService.getSupervisoresConAreas(obraId)
        .then(data => setSupervisores(data))
        .catch(() => setSupervisores([]))
        .finally(() => setLoadingSupervisores(false));
    }
  }, [obraId, activeTab]);

  // Convierte SupervisorWithAreas[] a User[]
  const supervisoresUsers: User[] = supervisores.map(s => ({
    id_usuario: s.id_usuario,
    usuario: '', // o puedes dejarlo vacío si no lo tienes
    auth_provider: 'local', // o el valor correcto si lo tienes
    correo: s.correo,
    nombres: s.nombres,
    apellidos: s.apellidos,
    global_role: 'supervisor',
  }));

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
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
            supervisores={supervisoresUsers}
          />
        )}

        {activeTab === 'supervisores' && (
          <SupervisoresTab obraId={obraId} isCoordinador={isCoordinador} />
        )}

        {activeTab === 'reportes' && (
          <ObraReportesTab obraId={obraId} />
        )}

      </div>
    </div>
  );
};

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