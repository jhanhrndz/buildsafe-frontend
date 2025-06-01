import React, { useState } from 'react';
import { Camera, Wifi, WifiOff, Edit2, Trash2, MoreVertical, Play, StopCircle } from 'lucide-react';
import type { Camara } from '../../types/entities';
import { useStreamController } from '../../hooks/features/useStream';

interface CamaraCardProps {
  camara: Camara;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const CamaraCard: React.FC<CamaraCardProps> = ({ camara, canEdit, onEdit, onDelete }) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showStream, setShowStream] = useState(false);

  // Hook de stream por cámara
  const { streams, isLoading, error, active, start, stop, getStreamUrl } = useStreamController();

  // Busca la url de stream de esta cámara
  const streamUrl = getStreamUrl(camara.id_camara);

  // Inicia el stream solo de esta cámara (por área)
  const handleStartStream = async () => {
    await start(camara.id_area); // Trae todas las cámaras del área
    setShowStream(true);
  };

  // Detiene el stream
  const handleStopStream = () => {
    stop();
    setShowStream(false);
  };

  return (
    <>
      <div className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-200">
        {/* Menú de acciones - esquina superior derecha */}
        {canEdit && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <MoreVertical size={16} />
            </button>
            
            {showActionMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5 border border-gray-200">
                <button
                  onClick={() => {
                    onEdit();
                    setShowActionMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  <Edit2 size={14} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowActionMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  <span>Eliminar</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Indicador de estado - posición dinámica según permisos */}
        <div className={`absolute top-4 ${canEdit ? 'right-16' : 'right-4'}`}>
          <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
            ${camara.estado === 'activa' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-gray-50 text-gray-600 border border-gray-200'
            }
          `}>
            {camara.estado === 'activa' ? (
              <Wifi size={12} className="text-green-600" />
            ) : (
              <WifiOff size={12} className="text-gray-500" />
            )}
            {camara.estado === 'activa' ? 'Activa' : 'Inactiva'}
          </div>
        </div>

        {/* Contenido principal */}
        <div className={`flex items-start gap-4 ${canEdit ? 'pr-20' : 'pr-4'}`}>
          {/* Ícono de cámara */}
          <div className={`
            flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
            ${camara.estado === 'activa' 
              ? 'bg-blue-50 text-blue-600 border border-blue-200' 
              : 'bg-gray-50 text-gray-400 border border-gray-200'
            }
          `}>
            <Camera size={20} />
          </div>

          {/* Información */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-2 truncate">{camara.nombre}</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">IP:</span>
                <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded ">
                  {camara.ip_stream}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Última conexión:</span>
                <span className="font-medium">
                  {camara.ultima_conexion || 'N/A'}
                </span>
              </div>
            </div>

            {/* Botón de stream */}
            {camara.estado === 'activa' && (
              <div className="mt-3 flex gap-2">
                {!showStream ? (
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                    onClick={handleStartStream}
                    disabled={isLoading}
                  >
                    <Play size={14} />
                    Ver stream
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                    onClick={handleStopStream}
                  >
                    <StopCircle size={14} />
                    Detener
                  </button>
                )}
              </div>
            )}

            {/* Mensajes de error */}
            {showStream && !streamUrl && (
              <div className="mt-4 text-xs text-red-600">No se encontró el stream de esta cámara.</div>
            )}
            {error && (
              <div className="mt-2 text-xs text-red-600">{error}</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para el stream */}
      {showStream && streamUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white rounded-xl shadow-2xl p-4 max-w-3xl w-full flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
              onClick={handleStopStream}
              title="Cerrar"
            >
              ×
            </button>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">{camara.nombre}</h2>
            <div className="w-full flex justify-center">
              <img
                src={streamUrl}
                alt={`Stream cámara ${camara.nombre}`}
                className="w-full max-h-[70vh] object-contain bg-black rounded-lg"
                onError={handleStopStream}
              />
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el menú cuando se hace clic fuera */}
      {showActionMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActionMenu(false)}
        />
      )}
    </>
  );
};

export default CamaraCard;