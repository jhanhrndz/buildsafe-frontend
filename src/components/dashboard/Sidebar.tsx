import { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  BuildingIcon, 
  BarChartIcon, 
  SettingsIcon, 
  MenuIcon, 
  XIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  LogOutIcon,
  HardHatIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import UserAvatar from './UserAvatar'

// Tipos para las rutas y roles
type UserRole = 'coordinador' | 'supervisor';

// Tipo para cada ítem del menú
interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles: UserRole[];
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useUserContext();
  
  // Obtén el rol del usuario del contexto
  const userRole = user?.global_role as UserRole || 'supervisor';
  const userName = user?.usuario || 'Usuario';

  // Lista de items del menú con sus roles permitidos
  const menuItems: MenuItem[] = [
    {
      name: 'Inicio',
      path: '/',
      icon: <HomeIcon size={20} />,
      allowedRoles: ['coordinador', 'supervisor']
    },
    {
      name: 'Obras',
      path: '/obras',
      icon: <BuildingIcon size={20} />,
      allowedRoles: ['coordinador', 'supervisor']
    },
    {
      name: 'Reportes',
      path: '/reportes',
      icon: <BarChartIcon size={20} />,
      allowedRoles: ['coordinador', 'supervisor']
    },
    {
      name: 'Configuración',
      path: '/configuracion',
      icon: <SettingsIcon size={20} />,
      allowedRoles: ['coordinador', 'supervisor']
    }
  ];

  // Filtrar menú items según el rol del usuario
  const filteredMenuItems = menuItems.filter(item => 
    item.allowedRoles.includes(userRole)
  );

  // Manejar resize para modo responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chequear si una ruta está activa
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Overlay para móvil con blur */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden transition-all duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Botón toggle para móvil mejorado */}
      <button
        className="fixed top-4 left-4 z-30 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 md:hidden backdrop-blur-sm border border-white/10"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? 
          <XIcon size={20} className="transition-transform duration-200" /> : 
          <MenuIcon size={20} className="transition-transform duration-200" />
        }
      </button>

      {/* Sidebar con glassmorphism */}
      <aside
        className={`
          fixed h-screen z-30 flex flex-col transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-72'} 
          ${isMobileOpen ? 'left-0' : '-left-full md:left-0'}
        `}
        style={{ overflow: 'hidden' }}
      >
        {/* Background con gradiente y blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/95 to-indigo-600/95 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
        
        {/* Contenido del sidebar */}
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          {/* Header - Logo y toggle */}
          <div className="p-6 border-b border-white/10 flex-shrink-0">
            {!isCollapsed ? (
              <div className="flex items-center w-full overflow-hidden">
                <div className="flex items-center space-x-3 flex-1 min-w-0 overflow-hidden pr-2">
                  {/* Logo con efecto glassmorphism */}
                  <div className="h-12 w-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <HardHatIcon size={24} className="text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h2 className="text-3xl font-bold text-white">BuildSafe</h2>
                    <p className="text-xs text-blue-100/80">Vigilancia inteligente para obras seguras.</p>
                  </div>
                </div>
                
                {/* Botón collapse - modo expandido */}
                <button
                  className="hidden md:flex p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20 flex-shrink-0"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  <ChevronLeftIcon size={18} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3 w-full">
                {/* Botón collapse - modo colapsado */}
                <button
                  className="hidden md:flex p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  <ChevronRightIcon size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Información del usuario con glassmorphism */}
          <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
            {!isCollapsed ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 overflow-hidden">
                <div className="flex items-center space-x-3 w-full">
                  <UserAvatar />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="font-medium text-sm text-white truncate">{userName}</p>
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 bg-green-400 rounded-full shadow-sm flex-shrink-0"></div>
                      <p className="text-xs text-blue-100/80 capitalize truncate">{userRole}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <UserAvatar />
              </div>
            )}
          </div>

          {/* Navegación */}
          <nav className="flex-1 py-6 overflow-y-auto min-h-0">
            <div className={`space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
              {filteredMenuItems.map((item, index) => (
                <div key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className={`
                      group relative flex items-center rounded-xl transition-all duration-200 w-full overflow-hidden
                      ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
                      ${isActive(item.path) 
                        ? 'bg-white/20 text-white shadow-lg border border-white/30 backdrop-blur-sm' 
                        : 'text-blue-100/90 hover:bg-white/10 hover:text-white hover:border-white/20 border border-transparent'
                      }
                    `}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setIsMobileOpen(false);
                      }
                    }}
                  >
                    {/* Indicador activo */}
                    {isActive(item.path) && !isCollapsed && (
                      <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-r-full shadow-lg" />
                    )}
                    
                    {/* Icono */}
                    <div className={`
                      flex items-center justify-center transition-all duration-200 flex-shrink-0
                      ${isActive(item.path) ? 'text-yellow-400' : 'text-blue-200 group-hover:text-white'}
                    `}>
                      {item.icon}
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <span className="ml-4 font-medium text-sm transition-all duration-200 flex-1 truncate">
                          {item.name}
                        </span>
                        {/* Indicador de item activo */}
                        {isActive(item.path) && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-yellow-400 shadow-sm animate-pulse flex-shrink-0" />
                        )}
                      </>
                    )}
                    
                    {/* Indicador activo para modo colapsado */}
                    {isActive(item.path) && isCollapsed && (
                      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-l-full shadow-lg" />
                    )}
                    
                    {/* Tooltip para modo colapsado */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700">
                        {item.name}
                        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900/90 rotate-45" />
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer con botón de logout mejorado */}
          <div className="p-6 border-t border-white/10 mt-auto flex-shrink-0">
            <button
              onClick={handleLogout}
              className={`
                group relative w-full flex items-center rounded-xl overflow-hidden
                text-blue-100/90 hover:bg-red-500/20 hover:text-white hover:border-red-400/30 
                transition-all duration-200 border border-transparent backdrop-blur-sm
                ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
              `}
            >
              <LogOutIcon size={20} className="group-hover:text-red-400 transition-colors duration-200 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium truncate">Cerrar Sesión</span>
              )}
              
              {/* Tooltip para modo colapsado */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700">
                  Cerrar Sesión
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900/90 rotate-45" />
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Espaciador para mantener el layout */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-0 md:ml-72'}`} />
    </>
  );
};

export default Sidebar;