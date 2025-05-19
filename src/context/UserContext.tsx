// src/context/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
} from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/entities';

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function UserProvider({ children }: { children: ReactNode }) {
  // 1) Inicializar token
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('jwtToken')
  );

  // 2) Inicializar user SIN validación estricta
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      // Simplemente parseamos y asumimos que el objeto guardado
      // coincide con nuestro tipo User
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  });

  // 3) login: guardamos el token y el user tal cual vienen
  const login = (newToken: string, userData: User) => {
    localStorage.setItem('jwtToken', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  // 4) logout
  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // 5) derivado
  const isAuthenticated = Boolean(token && user);
  console.log('isautenticated', isAuthenticated)
  // 6) memoizar
  const contextValue = useMemo(
    () => ({ user, token, login, logout, isAuthenticated }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUserContext = () => useContext(AuthContext);
