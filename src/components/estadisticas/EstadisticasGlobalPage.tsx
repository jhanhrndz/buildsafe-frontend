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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-md mx-4 transform hover:scale-105 transition-all duration-300">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 leading-relaxed">No tienes acceso a esta sección.</p>
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
    <div className="min-h-screen  relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="mx-auto px-4 relative">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-sm border border-gray-50 relative overflow-hidden">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm shadow-blue-400/25 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-gray-700 tracking-tight bg-clip-text mb-2">
                    Estadísticas Globales
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                    Vista general de las estadísticas de tus obras y reportes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación entre secciones */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl mb-8 border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
          <nav className="flex divide-x divide-gray-200/50">
            {secciones.map(({ id, nombre, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSeccionActiva(id as SeccionEstadistica)}
                className={`
                  flex-1 px-6 py-6 flex items-center justify-center gap-3 relative
                  transition-all duration-300 ease-out group
                  ${seccionActiva === id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:scale-105'
                  }
                `}
              >
                {/* Indicador activo */}
                {seccionActiva === id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full shadow-lg" />
                )}
                
                <div className={`
                  p-2 rounded-xl transition-all duration-300
                  ${seccionActiva === id 
                    ? 'bg-white/20 shadow-lg' 
                    : 'group-hover:bg-white/50 group-hover:shadow-md'
                  }
                `}>
                  <Icon size={24} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="font-semibold text-base relative z-10">{nombre}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de la sección activa */}
        <div className="transition-all duration-500 ease-in-out transform">
          {renderSeccion()}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasGlobalPage;