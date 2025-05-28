//types/entities.ts
export interface User {
  id_usuario: number;
  usuario: string;
  auth_provider: "local" | "google";
  google_id?: string;
  documento?: string;
  nombres?: string;
  apellidos?: string;
  correo: string;
  telefono?: string;
  global_role: 'coordinador' | 'supervisor';
}

// Tipo para registro local (extiende User y añade contraseña)
export interface RegisterPayload extends Omit<User,
  'id_usuario' | 'auth_provider' | 'google_id'
> {
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  usuario: string;
  contrasena: string;
}

export interface Obra {
  id_obra: number;
  id_coordinador: number;
  nombre: string;
  descripcion: string;
  fecha_inicio?: string;
  estado: 'activo' | 'inactivo' | 'finalizado';
  coordinador?: User;
  supervisores?: User[];
}


export interface Area {
  id_area: number;
  id_obra: number;
  nombre: string;
  descripcion?: string;
  id_usuario?: number | null;
}

export interface Camara {
  id_camara: number;
  id_area: number;
  ip_stream: string;
  nombre: string;
  estado: 'activo' | 'inactivo'; // Debe coincidir con tu base de datos y backend
  ultima_conexion?: string;
}

// Para crear una cámara (sin id_camara ni ultima_conexion)
export type CreateCamaraPayload = Omit<Camara, 'id_camara' | 'ultima_conexion'>;

// Para actualizar una cámara (requiere id_camara)
export type UpdateCamaraPayload = Partial<Omit<Camara, 'ultima_conexion'>> & { id_camara: number };

// Si necesitas filtros o respuestas paginadas en el futuro:
export interface CamaraFilters {
  id_area?: number;
  estado?: 'activo' | 'inactivo';
}

export interface CamarasResponse {
  camaras: Camara[];
  total: number;
}

/**
 * Supervisor con sus áreas (para listados con JSON_ARRAYAGG).
 */
export interface SupervisorWithAreas {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  areas: Array<{
    id_area: number;
    nombre_area: string;
  }>;
}