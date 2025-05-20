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
      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Botón toggle para móvil */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-blue-600 text-white md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed h-screen z-30 flex flex-col bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-xl transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'} 
          ${isMobileOpen ? 'left-0' : '-left-full md:left-0'}
        `}
      >
        {/* Logo y Marca */}
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <div className="flex items-center">
                <HardHatIcon size={28} className="text-yellow-400" />
                <span className="ml-2 text-xl font-bold text-white tracking-wider">BuildSafe</span>
              </div>
            ) : (
              <HardHatIcon size={28} className="text-yellow-400 mx-auto" />
            )}
            <button
              className="p-1 rounded-md text-white/70 hover:text-white hover:bg-blue-700"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={20} />}
            </button>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="mt-2 p-4 border-b border-blue-700">
          <div className="flex items-center">
            {!isCollapsed && (
              <div className="ml-3">
                <p className="font-medium text-sm text-white">{userName}</p>
                <p className="text-xs text-blue-200 capitalize">{userRole}</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-grow p-2 overflow-y-auto">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-700/60'
                    }
                  `}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setIsMobileOpen(false);
                    }
                  }}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3 font-medium text-sm">{item.name}</span>
                  )}
                  {isActive(item.path) && !isCollapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer con botón de logout */}
        <div className="p-4 border-t border-blue-700 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 rounded-lg text-blue-200 hover:bg-blue-700/60 transition-colors"
          >
            <LogOutIcon size={20} />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </aside>

      {/* Espaciador para mantener el layout cuando el sidebar está visible */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-0 md:ml-64'}`} />
    </>
  );
};

export default Sidebar;