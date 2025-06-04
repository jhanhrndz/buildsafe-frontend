import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStreamController } from '../../hooks/features/useStream';
import { useCamarasContext } from '../../context/CamarasContext';
import { ArrowLeft, Camera, Wifi, WifiOff, MoreVertical, FileText, X, Monitor, AlertCircle, Grid3X3, Grid2X2, Maximize2, Video, Eye, Activity, Clock } from 'lucide-react';
import ReportForm from '../reportes/ReportForm';
import { useReportsContext } from '../../context/ReportsContext';

const MonitoreoPage: React.FC = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();
  const { streams, isLoading, error, start, getStreamUrl, stop } = useStreamController();
  const { camaras, refresh, isLoading: isLoadingCamaras, error: camarasError } = useCamarasContext();
  const { create } = useReportsContext();
  const [streamErrors, setStreamErrors] = useState<{ [id: number]: boolean }>({});
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [fullscreenCamera, setFullscreenCamera] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reportModal, setReportModal] = useState<{
    open: boolean;
    image: File | null;
    idCamara: number | null;
  }>({ open: false, image: null, idCamara: null });
  
  const isLoadingTotal = isLoading || isLoadingCamaras;
  const errorTotal = error || camarasError;

  // Actualizar la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (areaId) {
      refresh(Number(areaId), true);
    }
  }, [areaId, refresh]);

  useEffect(() => {
    if (areaId) start(Number(areaId));
    return () => stop();
  }, [areaId]);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenCamera(null);
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const getNombreCamara = (id_camara: number) => {
    if (isLoadingCamaras) return "Cargando...";
    const cam = camaras.find(c => c.id_camara === id_camara);
    return cam ? cam.nombre : `Cámara #${id_camara}`;
  };

  const capturarFrame = (id_camara: number) => {
    const img = document.querySelector<HTMLImageElement>(`img[data-id="${id_camara}"]`);
    if (!img) {
      console.error('No se encontró la imagen para la cámara:', id_camara);
      return;
    }
    
    img.crossOrigin = "Anonymous";
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    try {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `captura_${id_camara}_${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          setReportModal({ open: true, image: file, idCamara: id_camara });
          setActiveMenu(null);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error capturando frame:', error);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id_camara: number) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id_camara ? null : id_camara);
  };

  const getGridClass = () => {
    const count = streams.length;
    
    switch (gridSize) {
      case 'large':
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-1 lg:grid-cols-2';
        return 'grid-cols-1 lg:grid-cols-2';
      case 'medium':
        if (count === 1) return 'grid-cols-1';
        if (count <= 4) return 'grid-cols-1 md:grid-cols-2';
        if (count <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 'small':
        if (count === 1) return 'grid-cols-1';
        if (count <= 4) return 'grid-cols-1 sm:grid-cols-2';
        if (count <= 9) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
        if (count <= 16) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const getCameraHeight = () => {
    switch (gridSize) {
      case 'large': return 'aspect-video min-h-[400px] lg:min-h-[500px]';
      case 'medium': return 'aspect-video min-h-[280px] md:min-h-[350px]';
      case 'small': return 'aspect-video min-h-[200px] sm:min-h-[250px]';
      default: return 'aspect-video min-h-[350px]';
    }
  };

  // Estadísticas de monitoreo
  const monitoreoStats = {
    total: streams.length,
    activas: streams.filter(s => !streamErrors[s.id_camara]).length,
    desconectadas: streams.filter(s => streamErrors[s.id_camara]).length,
    area: areaId ? `Área ${areaId}` : 'Sin área'
  };

  return (
    <div className="flex-1 min-h-screen">
      <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Enhanced Header Section */}
          <div className="space-y-8">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al panel
            </button>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-sm border border-gray-50 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-blue-600/5 rounded-full -translate-y-32 translate-x-32"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-500/25 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <Monitor className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-gray-700 tracking-tight bg-clip-text mb-2">
                      Centro de Monitoreo
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                      Supervisión en tiempo real de todas las cámaras de seguridad del área
                    </p>
                  </div>
                </div>
                
                {/* Grid Controls */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-2">
                  <button
                    onClick={() => setGridSize('large')}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      gridSize === 'large' 
                        ? 'bg-white shadow-sm text-blue-600 scale-105' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title="Vista grande"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setGridSize('medium')}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      gridSize === 'medium' 
                        ? 'bg-white shadow-sm text-blue-600 scale-105' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title="Vista mediana"
                  >
                    <Grid2X2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setGridSize('small')}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      gridSize === 'small' 
                        ? 'bg-white shadow-sm text-blue-600 scale-105' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title="Vista compacta"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Error Alert */}
          {errorTotal && (
            <div className="rounded-2xl border border-red-200/50 bg-gradient-to-r from-red-50/80 to-red-100/30 backdrop-blur-sm p-8 shadow-sm transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 mb-2 text-lg">Error de conexión</h3>
                  <p className="text-red-700">{errorTotal}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {isLoadingTotal ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <p className="text-gray-900 font-semibold text-xl mb-2">Conectando cámaras...</p>
                <p className="text-gray-600">Estableciendo conexión con los dispositivos</p>
              </div>
            </div>
          ) : streams.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
              <div className="p-24 text-center">
                <Camera className="mx-auto h-20 w-20 text-gray-300 mb-8" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No hay cámaras disponibles</h3>
                <p className="text-gray-600 text-lg">No se encontraron dispositivos activos en esta área.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
              <div className="bg-blue-500 px-8 py-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Cámaras en Vivo</h3>
                      <p className="text-blue-100 text-sm">Monitoreo en tiempo real • {monitoreoStats.activas} de {monitoreoStats.total} activas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-white">Sistema operativo</span>
                    </div>
                    <p className="text-xs text-blue-100 tabular-nums">{currentTime.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className={`grid ${getGridClass()} gap-6`}>
                  {streams.map(cam => {
                    const camaraInfo = camaras.find(c => c.id_camara === cam.id_camara);
                    const hasError = streamErrors[cam.id_camara];
                    const isMenuActive = activeMenu === cam.id_camara;
                    
                    return (
                      <div key={cam.id_camara} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${hasError ? 'bg-red-500' : 'bg-green-500'}`} />
                            <h3 className="font-semibold text-gray-900">{getNombreCamara(cam.id_camara)}</h3>
                            {!hasError && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">LIVE</span>}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setFullscreenCamera(cam.id_camara)}
                              className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all"
                              disabled={hasError}
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            
                            <div className="relative">
                              <button
                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                                onClick={(e) => toggleMenu(e, cam.id_camara)}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              
                              {isMenuActive && (
                                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                  <button
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    onClick={() => capturarFrame(cam.id_camara)}
                                    disabled={hasError}
                                  >
                                    <FileText className="w-4 h-4" />
                                    Crear reporte
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stream */}
                        <div className={`relative bg-black ${getCameraHeight()}`}>
                          {!hasError ? (
                            <img
                              src={getStreamUrl(cam.id_camara)}
                              alt={`Stream ${getNombreCamara(cam.id_camara)}`}
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover cursor-pointer"
                              onError={() => setStreamErrors(prev => ({ ...prev, [cam.id_camara]: true }))}
                              onClick={() => setFullscreenCamera(cam.id_camara)}
                              data-id={cam.id_camara}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full p-8">
                              <WifiOff className="w-16 h-16 text-red-400 mb-4" />
                              <span className="text-red-400 font-medium text-lg mb-2">Sin conexión</span>
                              <span className="text-xs text-gray-500 mb-6 font-mono text-center max-w-xs">
                                {camaraInfo?.ip_stream || 'Sin URL'}
                              </span>
                              <button
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => setStreamErrors(prev => {
                                  const copy = { ...prev };
                                  delete copy[cam.id_camara];
                                  return copy;
                                })}
                              >
                                Reconectar
                              </button>
                            </div>
                          )}
                          
                          {!hasError && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                              <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                  <Wifi className="w-4 h-4 text-green-400" />
                                  <span className="text-sm font-medium">En vivo</span>
                                </div>
                                <span className="text-sm font-mono bg-black/50 px-2 py-1 rounded tabular-nums">
                                  {currentTime.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen */}
      {fullscreenCamera !== null && (
        <div className="fixed inset-0 bg-black z-50">
          <button
            onClick={() => setFullscreenCamera(null)}
            className="absolute top-6 right-6 p-3 bg-black/70 hover:bg-black/90 text-white rounded-lg z-10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full h-full flex items-center justify-center p-6">
            {!streamErrors[fullscreenCamera] ? (
              <img
                src={getStreamUrl(fullscreenCamera)}
                alt={`Fullscreen ${getNombreCamara(fullscreenCamera)}`}
                className="max-w-full max-h-full object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="text-center text-white">
                <WifiOff className="w-24 h-24 mx-auto mb-4 text-red-400" />
                <p className="text-xl">Cámara desconectada</p>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-3 rounded-lg">
            <h3 className="font-medium text-lg">{getNombreCamara(fullscreenCamera)}</h3>
            <p className="text-sm text-gray-300">Presiona ESC para salir</p>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Crear Reporte de Incidente</h2>
              <button
                onClick={() => setReportModal({ open: false, image: null, idCamara: null })}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
              <ReportForm
                areaId={Number(areaId)}
                camaras={camaras}
                onSuccess={() => setReportModal({ open: false, image: null, idCamara: null })}
                onCancel={() => setReportModal({ open: false, image: null, idCamara: null })}
                initialValues={{
                  id_camara: reportModal.idCamara ?? undefined,
                  imagen_url: reportModal.image ? URL.createObjectURL(reportModal.image) : undefined,
                }}
                imagenFile={reportModal.image}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoreoPage;