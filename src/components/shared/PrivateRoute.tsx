// src/components/shared/PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
  roles?: Array<'coordinador' | 'supervisor'>;
  public?: boolean; // Nuevo prop para rutas públicas
}

export const PrivateRoute = ({ children, roles, public: isPublic = false }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useUserContext();
  const location = useLocation();
  const fromLocation = location.state?.from || '/';

  // Lógica para rutas públicas
  if (isPublic) {
    return isAuthenticated ? (
      <Navigate to={fromLocation} replace />
    ) : (
      children
    );
  }

  // Lógica para rutas privadas
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user?.global_role && !roles.includes(user.global_role)) {
    return <Navigate to="/no-autorizado" state={{ from: location }} replace />;
  }

  return children;
};