// src/components/shared/PrivateRoute.tsx
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

  // 2) Si hay roles y el user no coincide, a /no-autorizado
  if (roles && !roles.includes(user!.global_role)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  // 3) Si todo OK, renderiza children
  return <>{children}</>;
};
