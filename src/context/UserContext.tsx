// src/context/UserContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Recuperar estado al cargar
// Añadir validación de datos
useEffect(() => {
  const storedToken = localStorage.getItem('jwtToken');
  const storedUser = localStorage.getItem('user');
  
  if (storedToken && storedUser) {
    try {
      const parsedUser: User = JSON.parse(storedUser);
      
      // Validar estructura del usuario
      if (parsedUser?.id_usuario && parsedUser?.global_role) {
        setToken(storedToken);
        setUser(parsedUser);
      } else {
        console.error('Datos de usuario inválidos');
        logout();
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      logout();
    }
  }
}, []);

  // Método de login
const login = (newToken: string, userData: User) => {
  try {
    const userString = JSON.stringify(userData);
    localStorage.setItem('jwtToken', newToken);
    localStorage.setItem('user', userString);
    setToken(newToken);
    setUser(userData);
    console.log(userData)
  } catch (error) {
    console.error('Error saving user data:', error);
    logout();
  }
};

  // Método de logout
  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token, // Token disponible directamente aquí
        login,
        logout,
        isAuthenticated: !!token && !!user, // Depende solo del token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useUserContext = () => useContext(AuthContext);