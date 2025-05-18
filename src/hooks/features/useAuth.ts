import { useState } from 'react';
import { AuthService } from '../../services/auth';
import { useUserContext } from '../../context/UserContext';
import type {
  RegisterPayload,
  LoginCredentials,
  LoginResponse
} from '../../types/entities';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const { login, logout: contextLogout } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthOperation = async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await operation();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de autenticación';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const executeLogin = async (
    authMethod: () => Promise<LoginResponse>
  ): Promise<boolean> => {
    const result = await handleAuthOperation(authMethod);

    if (result) {
      console.log('Login exitoso. Datos recibidos:', result);
      login(result.token, result.user);
      navigate('/');
      return true;
    }
    return false;
  };

  return {
    // Métodos principales
    loginLocal: (credentials: LoginCredentials) =>
      executeLogin(() => AuthService.loginLocal(credentials)),

    loginGoogle: () => executeLogin(AuthService.loginGoogle),

    registerLocal: (payload: RegisterPayload) =>
      executeLogin(() => AuthService.registerLocal(payload)),

    logout: async () => {
      await handleAuthOperation(async () => {
        await AuthService.logout();
        contextLogout();
      });
    },

    // Estado
    isLoading,
    error,
    clearError: () => setError(null)
  };
};