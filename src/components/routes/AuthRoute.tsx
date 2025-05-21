// src/components/routes/AuthRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import type { ReactNode } from 'react';

interface AuthRouteProps {
  children: ReactNode;
  // Define si esta ruta es solo para usuarios no autenticados
  authOnly?: boolean;
}

/**
 * Componente que protege rutas públicas (login, registro) de usuarios ya autenticados
 * y maneja la redirección según el estado del usuario
 */
export const AuthRoute = ({
  children,
  authOnly = true,
}: AuthRouteProps) => {
  const { isAuthenticated, user } = useUserContext();
  const location = useLocation();

  // Si el usuario está autenticado, no debería ver páginas de login/registro
  if (authOnly && isAuthenticated) {
    // Verificar si el usuario tiene registro incompleto
    const isIncomplete = user && (!user.documento || !user.global_role || !user.telefono);
    
    // Si tiene registro incompleto, dirigir a completar registro
    // Si no, dirigir a la página principal

    console.log(isIncomplete);
    console.log(user);
    return <Navigate to={isIncomplete ? '/complete-registration' : '/'} replace />;
  }

  // Si no está autenticado pero intenta acceder a una página protegida, redirigir a login
  if (!authOnly && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si todo está bien, renderizar los hijos
  return <>{children}</>;
};