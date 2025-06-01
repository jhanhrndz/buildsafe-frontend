import React from 'react';
import type { ReporteDetail } from '../../types/entities';
import { X, Calendar, MapPin, Building2, User, AlertTriangle, Camera, CheckCircle, Clock, XCircle } from 'lucide-react';

interface ReportDetailProps {
  reporte: ReporteDetail;
  onClose: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ reporte, onClose }) => {
  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'resuelto':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pendiente':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'en proceso':
      case 'en_proceso':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelado':
      case 'rechazado':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 px-6 py-4 relative">
          <button 
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200" 
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white pr-12">Detalle del Reporte</h2>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium mt-2 ${getStatusColor(reporte.estado)}`}>
            {getStatusIcon(reporte.estado)}
            {reporte.estado}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Description Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Descripción</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed">
                {reporte.descripcion || 'Sin descripción disponible'}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha y Hora</p>
                  <p className="text-gray-900 font-semibold">
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

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Área</p>
                  <p className="text-gray-900 font-semibold">{reporte.nombre_area || 'No especificada'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Obra</p>
                  <p className="text-gray-900 font-semibold">{reporte.nombre_obra || 'No especificada'}</p>
                </div>
              </div>
            </div>

            {reporte.usuario && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reportado por</p>
                    <p className="text-gray-900 font-semibold">
                      {reporte.usuario.nombres} {reporte.usuario.apellidos}
                    </p>
                    <p className="text-xs text-gray-500">{reporte.usuario.correo}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Evidence Section */}
          {reporte.imagen_url && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-4 h-4 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Evidencia Fotográfica</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-center">
                  <img 
                    src={reporte.imagen_url} 
                    alt="Evidencia del reporte" 
                    className="rounded-lg border-2 border-gray-200 max-w-full h-auto max-h-96 object-contain shadow-md hover:shadow-lg transition-shadow duration-200" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* EPP Violations Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Infracciones de EPP</h3>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              {reporte.infracciones && reporte.infracciones.length > 0 ? (
                <div className="space-y-3">
                  {reporte.infracciones.map((inf, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-red-100">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">{inf.nombre}</span>
                        {inf.categoria_epp && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            {inf.categoria_epp}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">No se registraron infracciones de EPP</p>
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