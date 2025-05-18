import { apiClient } from '../hooks/api';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import type { 
  RegisterPayload, 
  LoginResponse, 
  LoginCredentials 
} from '../types/entities';

export const AuthService = {
  async loginLocal(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login', 
      credentials
    );
    return response.data;
  },

async loginGoogle(): Promise<LoginResponse> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseToken = await result.user.getIdToken();
    
    const response = await apiClient.post<LoginResponse>('/auth/google', {
      token: firebaseToken
    });

    if (!response.data.user || !response.data.token) {
      throw new Error('Respuesta inválida del servidor');
    }

    return response.data;
  } catch (error) {
    console.error('Error en login con Google:', error);
    throw new Error('Error al autenticar con Google');
  }
},

  async registerLocal(payload: RegisterPayload): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/register', 
      { ...payload, auth_provider: 'local' }
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await auth.signOut();
  }
};