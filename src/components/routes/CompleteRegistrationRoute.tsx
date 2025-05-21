// src/components/routes/CompleteRegistrationRoute.tsx
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import type { ReactNode } from 'react';

interface CompleteRegistrationRouteProps {
  children: ReactNode;
}

/**
 * Componente específico para la ruta de completar registro
 * - Solo accesible para usuarios autenticados
 * - Solo accesible para usuarios con datos incompletos
 * - Usuarios completos son redirigidos a home
 * - Usuarios no autenticados son redirigidos a login
 */
export const CompleteRegistrationRoute = ({ 
  children 
}: CompleteRegistrationRouteProps) => {
  const { isAuthenticated, user } = useUserContext();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario tiene registro incompleto
  const isIncomplete = user && (!user.documento || !user.global_role || !user.telefono);

  console.log(user);

  // Si el registro ya está completo, redirigir a home
  if (!isIncomplete) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario está autenticado pero con datos incompletos, permitir acceso
  return <>{children}</>;
};