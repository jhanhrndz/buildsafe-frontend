import { useState, useRef, useCallback } from 'react';
import { getCamarasStreamByArea, getStreamUrl } from '../../services/stream';
import type { CamaraStreamInfo } from '../../services/stream';

type UseStreamControllerResult = {
  streams: CamaraStreamInfo[];
  isLoading: boolean;
  error: string | null;
  active: boolean;
  start: (areaId: number) => Promise<void>;
  stop: () => void;
  getStreamUrl: (id_camara: number) => string | undefined;
};

export function useStreamController(): UseStreamControllerResult {
  const [streams, setStreams] = useState<CamaraStreamInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  const start = useCallback(async (areaId: number) => {
    setIsLoading(true);
    setError(null);
    setActive(false);
    abortController.current = new AbortController();
    try {
      const data = await getCamarasStreamByArea(areaId);
      setStreams(data);
      setActive(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener streams');
      setStreams([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    abortController.current?.abort();
    setStreams([]);
    setActive(false);
    setError(null);
  }, []);

  const getStreamUrlById = useCallback(
    (id_camara: number) => {
      const cam = streams.find(c => c.id_camara === id_camara);
      return cam ? getStreamUrl(cam.stream_url) : undefined;
    },
    [streams]
  );

  return {
    streams,
    isLoading,
    error,
    active,
    start,
    stop,
    getStreamUrl: getStreamUrlById,
  };
}