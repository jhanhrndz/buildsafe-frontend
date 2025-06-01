import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStreamController } from '../../hooks/features/useStream';
import { useCamarasContext } from '../../context/CamarasContext';
import { ArrowLeft } from 'lucide-react';

const MonitoreoPage: React.FC = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();
  const { streams, isLoading, error, start, getStreamUrl, stop } = useStreamController();
  const { camaras } = useCamarasContext(); // <-- aquí traes todas las cámaras del área

  useEffect(() => {
    if (areaId) start(Number(areaId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId]);

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper para obtener el nombre real de la cámara
  const getNombreCamara = (id_camara: number) => {
    const cam = camaras.find(c => c.id_camara === id_camara);
    return cam ? cam.nombre : `Cámara #${id_camara}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto">
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
          {streams.map(cam => {
            const camaraInfo = camaras.find(c => c.id_camara === cam.id_camara);
            return (
              <div key={cam.id_camara} className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-200">
                <div className="w-full flex justify-center mb-2">
                  <img
                    src={getStreamUrl(cam.id_camara)}
                    alt={`Stream cámara ${getNombreCamara(cam.id_camara)}`}
                    className="w-full max-h-[420px] object-contain bg-black rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800">
                    {getNombreCamara(cam.id_camara)}
                  </div>
                  <div className="text-xs text-gray-500 break-all">
                    {/* Muestra la URL real de la cámara */}
                    {camaraInfo?.ip_stream || 'Sin URL'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {streams.length === 0 && !isLoading && (
          <div className="text-gray-500 text-center mt-12">No hay cámaras activas para monitorear.</div>
        )}
      </div>
    </div>
  );
};

export default MonitoreoPage;