import React, { useState } from 'react';
import { useEstadisticasGlobal } from '../../hooks/features/useEstadisticasGlobal';
import { useUserContext } from '../../context/UserContext';
import EstadisticasReportes from './EstadisticasReportes';
import EstadisticasObras from './EstadisticasObras';
import EstadisticasSupervisores from './EstadisticasSupervisores';
import EstadisticasAreas from './EstadisticasAreas';
import { BarChart3, Building2, Users, Layout } from 'lucide-react';

// Tipo para las secciones de estadísticas
type SeccionEstadistica = 'reportes' | 'obras' | 'areas' | 'supervisores';

// Configuración de las secciones
const secciones = [
  { id: 'reportes', nombre: 'Reportes', icon: BarChart3 },
  { id: 'obras', nombre: 'Obras', icon: Building2 },
  { id: 'areas', nombre: 'Áreas', icon: Layout },
  { id: 'supervisores', nombre: 'Supervisores', icon: Users }
] as const;

const EstadisticasGlobalPage: React.FC = () => {
  const stats = useEstadisticasGlobal();
  const { user } = useUserContext();
  const [seccionActiva, setSeccionActiva] = useState<SeccionEstadistica>('reportes');

  if (user?.global_role !== 'coordinador') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">No tienes acceso a esta sección.</p>
        </div>
      </div>
    );
  }

  // Renderizar el componente correspondiente según la sección activa
  const renderSeccion = () => {
    switch (seccionActiva) {
      case 'reportes':
        return <EstadisticasReportes stats={stats} />;
      case 'obras':
        return <EstadisticasObras stats={stats} />;
      case 'areas':
        return <EstadisticasAreas stats={stats} />;
      case 'supervisores':
        return <EstadisticasSupervisores stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas Globales</h1>
          <p className="mt-2 text-gray-600">
            Vista general de las estadísticas de tus obras y reportes
          </p>
        </div>

        {/* Navegación entre secciones */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <nav className="flex divide-x divide-gray-200">
            {secciones.map(({ id, nombre, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSeccionActiva(id as SeccionEstadistica)}
                className={`
                  flex-1 px-4 py-4 flex items-center justify-center gap-2
                  transition-colors duration-200
                  ${seccionActiva === id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{nombre}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de la sección activa */}
        <div className="transition-all duration-300 ease-in-out">
          {renderSeccion()}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasGlobalPage;