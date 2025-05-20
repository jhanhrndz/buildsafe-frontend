import { useState } from 'react';
import { UserService } from '../../services/user';
import type { User } from '../../types/entities';

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (userId: number, userData: Partial<User>) => {
    setIsLoading(true);
    setError(null);

    try {
      return await UserService.updateUser(userId, userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error actualizando usuario';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading, error, clearError: () => setError(null) };
};