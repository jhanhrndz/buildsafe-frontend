import { useState, useEffect } from 'react';
import { 
  BellIcon,
  LogOutIcon,
  SearchIcon,
  Settings,
  User,
  ChevronDown
} from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import UserAvatar from '../shared/UserAvatar';

interface NavbarProps {
  setPageTitle?: (title: string) => void;
}

const Navbar = ({ setPageTitle }: NavbarProps) => {
  const { user, logout } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Nueva alerta de seguridad', read: false, time: '5 min' },
    { id: 2, text: 'Reporte semanal disponible', read: false, time: '2 horas' },
    { id: 3, text: 'Actualización del sistema', read: true, time: '1 día' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Determinar el título según la ruta
  useEffect(() => {
    if (!setPageTitle) return;

    const path = location.pathname;
    if (path === '/') {
      setPageTitle('Dashboard');
    } else if (path.startsWith('/obras')) {
      setPageTitle('Gestión de Obras');
    } else if (path.startsWith('/reportes')) {
      setPageTitle('Reportes y Análisis');
    } else if (path.startsWith('/configuracion')) {
      setPageTitle('Configuración');
    }
  }, [location.pathname, setPageTitle]);

  // Función para manejar el logout
  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  // Manejar click en notificación
  const handleNotificationClick = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Cerrar menus al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowNotifications(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 w-full px-4 sm:px-6 h-16 flex items-center justify-between z-10 shadow-sm">
      {/* Título de página móvil (oculto en desktop) */}
      <div className="md:hidden font-medium text-gray-800">
        BuildSafe
      </div>

      {/* Sección derecha */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Notificaciones */}
        <div className="relative">
          <button 
            className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 focus:outline-none transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <BellIcon size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>
          
          {/* Menú de notificaciones */}
          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-gray-800">Notificaciones</p>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-500">{unreadCount} sin leer</p>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <p className={`text-sm ${!notification.read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                          {notification.text}
                        </p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-500">No hay notificaciones</p>
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-xs text-blue-600 hover:text-blue-800 w-full text-center">
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Perfil de usuario */}
        <div className="relative">
          <button 
            className="flex items-center space-x-3 focus:outline-none rounded-full hover:bg-gray-50 py-2 px-3"
            onClick={(e) => {
              e.stopPropagation();
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <UserAvatar />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">
                {user?.nombres 
                  ? `${user.nombres} ${user.apellidos || ''}`
                  : user?.usuario || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.global_role || 'usuario'}</p>
            </div>
            <ChevronDown size={16} className="text-gray-500 hidden md:block" />
          </button>

          {/* Menú desplegable */}
          {showUserMenu && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">
                  {user?.nombres 
                    ? `${user.nombres} ${user.apellidos || ''}`
                    : user?.usuario || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.correo || ''}</p>
              </div>
              <a 
                href="/configuracion/perfil" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User size={16} className="mr-3 text-gray-500" />
                Mi Perfil
              </a>
              <a 
                href="/configuracion" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings size={16} className="mr-3 text-gray-500" />
                Configuración
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOutIcon size={16} className="mr-3" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;