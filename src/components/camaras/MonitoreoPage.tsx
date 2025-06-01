import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStreamController } from '../../hooks/features/useStream';
import { ArrowLeft } from 'lucide-react';

const MonitoreoPage: React.FC = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();
  const { streams, isLoading, error, start, getStreamUrl } = useStreamController();

  useEffect(() => {
    if (areaId) start(Number(areaId));
    // Limpia el stream al salir si tu hook lo soporta
    // return () => stop();
  }, [areaId, start]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Monitoreo de cámaras</h1>
        {isLoading && <div className="text-gray-600">Cargando cámaras activas...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {streams.map(cam => (
            <div key={cam.id_camara} className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-200">
              <div className="w-full flex justify-center mb-2">
                <img
                  src={getStreamUrl(cam.id_camara)}
                  alt={`Stream cámara ${cam.id_camara}`}
                  className="w-full max-h-[320px] object-contain bg-black rounded-lg"
                />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">Cámara #{cam.id_camara}</div>
                <div className="text-xs text-gray-500 break-all">{cam.stream_url}</div>
              </div>
            </div>
          ))}
        </div>
        {streams.length === 0 && !isLoading && (
          <div className="text-gray-500 text-center mt-12">No hay cámaras activas para monitorear.</div>
        )}
      </div>
    </div>
  );
};

export default MonitoreoPage;