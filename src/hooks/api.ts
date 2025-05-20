import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  console.log('Interceptor request - Token:', token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => {
    console.log('Respuesta exitosa:', response.config.url);
    console.log('Datos de respuesta:', response.data);
    return response;
  },
  (error) => {
    console.error('Error en respuesta:', error.config?.url, error.response?.status);
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const useApi = () => {
  const get = <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data);

  const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data);

  const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data);

  const del = <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data);

  const upload = <T>(url: string, file: File, fieldName = 'file') => {
    const formData = new FormData();
    formData.append(fieldName, file);
    return apiClient.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data);
  };

  return { get, post, put, del, upload };
};

export { apiClient, queryClient };