import { useApi } from '../hooks/api';
import type { CamaraStreamInfo } from '../types/entities';

/**
 * Obtiene la lista de cámaras con su stream_url para un área.
 */
export async function getCamarasStreamByArea(areaId: number): Promise<CamaraStreamInfo[]> {
  const { get } = useApi();
  // Ruta: /api/stream/area/:areaId/camaras
  return await get<CamaraStreamInfo[]>(`/stream/area/${areaId}/camaras`);
}

/**
 * Devuelve la URL absoluta del stream de una cámara.
 */
export function getStreamUrl(stream_url: string): string {
  const base = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api';
  let url = stream_url.startsWith('http')
    ? stream_url
    : stream_url.startsWith('/api')
      ? base.replace(/\/api$/, '') + stream_url
      : base + stream_url;

  // Agrega el token como query param si existe
  const token = localStorage.getItem('jwtToken');
  if (token) {
    url += (url.includes('?') ? '&' : '?') + 'token=' + encodeURIComponent(token);
  }
  return url;
}