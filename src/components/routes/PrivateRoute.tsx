// src/components/routes/PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
  roles?: Array<'coordinador' | 'supervisor'>;
}

export const PrivateRoute = ({
  children,
  roles,
}: PrivateRouteProps) => {
  const { isAuthenticated, user } = useUserContext();
  const location = useLocation();

  // 1) Si no está autenticado, a /login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // 2) Verificar si el usuario tiene registro incompleto
  const isIncomplete = user && (!user.documento || !user.global_role || !user.telefono);
  
  // Si tiene datos incompletos, redirigir a completar registro
  if (isIncomplete) {
    return <Navigate to="/complete-registration" replace />;
  }

  // 3) Si hay roles y el user no coincide, a /no-autorizado
  if (roles && !roles.includes(user!.global_role)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  // 4) Si todo OK, renderiza children
  return <>{children}</>;
};