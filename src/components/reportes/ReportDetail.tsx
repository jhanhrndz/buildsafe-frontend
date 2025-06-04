import React from 'react';
import { X, Calendar, MapPin, Building2, User, AlertTriangle, Camera, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Usuario {
  nombres: string;
  apellidos: string;
  correo: string;
}

interface Infraccion {
  nombre: string;
  categoria_epp?: string;
}

interface ReporteDetail {
  descripcion: string;
  fecha_hora: string;
  nombre_area?: string;
  nombre_obra?: string;
  estado: string;
  imagen_url?: string;
  usuario?: Usuario;
  infracciones?: Infraccion[];
  id_camara?: number | null;
  camara_nombre?: string | null;
}

interface ReportDetailProps {
  reporte: ReporteDetail;
  onClose: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ reporte, onClose }) => {
  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'resuelto':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm';
      case 'pendiente':
        return 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm';
      case 'en proceso':
      case 'en_proceso':
        return 'bg-orange-50 text-orange-700 border-orange-300 shadow-sm';
      case 'cancelado':
      case 'rechazado':
        return 'bg-red-50 text-red-700 border-red-300 shadow-sm';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300 shadow-sm';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'resuelto':
        return <CheckCircle className="w-4 h-4" />;
      case 'pendiente':
        return <Clock className="w-4 h-4" />;
      case 'en proceso':
      case 'en_proceso':
        return <AlertTriangle className="w-4 h-4" />;
      case 'cancelado':
      case 'rechazado':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 ">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <button
            className="absolute top-6 right-6 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2.5 transition-all duration-200 hover:scale-105 z-10"
            onClick={onClose}
          >
            <X size={22} />
          </button>
          <div className="relative ">
            <h2 className="text-3xl font-bold text-white pr-16 mb-3">Detalle del Reporte</h2>
            <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 text-sm font-semibold ${getStatusColor(reporte.estado)}`}>
              {getStatusIcon(reporte.estado)}
              <span className="capitalize">{reporte.estado}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(92vh-140px)] space-y-8">
          {/* Description Section */}
          <div className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Descripción</h3>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-gray-800 leading-relaxed text-base">
                {reporte.descripcion || 'Sin descripción disponible'}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Fecha y Hora</p>
                  <p className="text-gray-900 font-bold text-lg mt-1">
                    {new Date(reporte.fecha_hora).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Área</p>
                  <p className="text-gray-900 font-bold text-lg mt-1">{reporte.nombre_area || 'No especificada'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Obra</p>
                  <p className="text-gray-900 font-bold text-lg mt-1">{reporte.nombre_obra || 'No especificada'}</p>
                </div>
              </div>
            </div>

            {reporte.usuario && (
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Reportado por</p>
                    <p className="text-gray-900 font-bold text-lg mt-1">
                      {reporte.usuario.nombres} {reporte.usuario.apellidos}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{reporte.usuario.correo}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Camera Section - Fixed condition */}
          {(reporte.id_camara || reporte.camara_nombre) && (
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <Camera className="w-6 h-6 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Cámara</p>
                  <p className="text-gray-900 font-bold text-lg mt-1">
                    {reporte.camara_nombre || `Cámara ${reporte.id_camara}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Evidence Section */}
          {reporte.imagen_url && (
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                  <Camera className="w-5 h-5 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Evidencia Fotográfica</h3>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-300 transition-colors duration-300">
                <div className="flex justify-center">
                  <img
                    src={reporte.imagen_url}
                    alt="Evidencia del reporte"
                    className="rounded-xl border-2 border-white max-w-full h-auto max-h-96 object-contain shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* EPP Violations Section */}
          <div className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-rose-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Infracciones de EPP</h3>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-200 hover:border-red-300 transition-colors duration-300">
              {reporte.infracciones && reporte.infracciones.length > 0 ? (
                <div className="space-y-4">
                  {reporte.infracciones.map((inf, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white rounded-xl p-4 border-2 border-red-100 hover:border-red-200 hover:shadow-md transition-all duration-200 group/infraction">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm group-hover/infraction:scale-110 transition-transform duration-200"></div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-base">{inf.nombre}</span>
                        {inf.categoria_epp && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 text-xs font-bold rounded-full border border-red-200 shadow-sm">
                            {inf.categoria_epp}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">No se registraron infracciones de EPP</p>
                  <p className="text-gray-500 text-sm mt-1">El cumplimiento de seguridad está al día</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;