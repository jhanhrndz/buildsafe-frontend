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

export interface Obra {
    id_obra: number;
    id_coordinador: number;
    nombre: string;
    descripcion: string;
    fecha_inicio?: string;
    estado: 'activo' | 'inactivo' | 'finalizado';
}


export interface Area {
    id_area: number;
    id_obra: number;
    nombre: string;
    descripcion?: string;
    id_supervisor?: number | null;
}

export interface Camara {
    id_camara: number;
    id_area: number;
    ip_stream: string;
    nombre: string;
    estado: 'activo' | 'inactivo';
    ultima_conexion?: string;
}