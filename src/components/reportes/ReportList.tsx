import React from 'react';
import type { ReporteResumen } from '../../types/entities';
import { Pencil, Trash2, Eye, User, MapPin, Building, Calendar, AlertCircle, Clock, CheckCircle2, Pause, X } from 'lucide-react';

interface ReportListProps {
  reportes: ReporteResumen[];
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onChangeEstado?: (id: number, currentEstado: string) => void;
  isLoading?: boolean;
  error?: string | null;
  user?: {
    global_role?: string;
  } | null;
}

const ReportList: React.FC<ReportListProps> = ({
  reportes,
  onView,
  onEdit,
  onDelete,
  onChangeEstado,
  isLoading,
  error,
  user,
}) => {
  console.log('Reportes:', reportes.map(r => r.id_reporte));

  const getStatusConfig = (estado: string) => {
    const configs = {
      'Pendiente': { 
        color: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200',
        icon: Clock,
        dot: 'bg-amber-400'
      },
      'En Proceso': { 
        color: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200',
        icon: Pause,
        dot: 'bg-blue-400'
      },
      'Completado': { 
        color: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
        dot: 'bg-emerald-400'
      },
      'Cancelado': { 
        color: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200',
        icon: X,
        dot: 'bg-gray-400'
      },
    };
    return configs[estado as keyof typeof configs] || configs['Pendiente'];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 animate-ping"></div>
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-spin">
            <div className="absolute top-2 left-2 w-12 h-12 rounded-full bg-white"></div>
          </div>
        </div>
        <p className="text-gray-600 font-semibold mt-6 text-lg">Cargando reportes...</p>
        <p className="text-gray-500 text-sm mt-1">Obteniendo la información más reciente</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-red-600 font-medium text-center max-w-md leading-relaxed">{error}</p>
        <div className="mt-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">Intenta recargar la página</p>
        </div>
      </div>
    );
  }

  if (!reportes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
            <Building className="h-12 w-12 text-gray-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Sin reportes disponibles</h3>
        <p className="text-gray-500 text-center max-w-md leading-relaxed">
          Los reportes aparecerán aquí una vez que se generen. 
          <span className="block mt-1 text-sm">¡Mantente atento a las nuevas actualizaciones!</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reportes.map((reporte) => {
        const statusConfig = getStatusConfig(reporte.estado);
        const StatusIcon = statusConfig.icon;
        
        return (
          <div
            key={reporte.id_reporte}
            className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:border-transparent hover:bg-gradient-to-r hover:from-white hover:to-gray-50 overflow-hidden"
          >
            {/* Decorative gradient border on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            <div className="absolute inset-[1px] bg-white rounded-2xl z-0"></div>
            
            <div className="relative z-10 p-5">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="flex-1 cursor-pointer group-hover:translate-x-1 transition-transform duration-300"
                  onClick={() => onView(reporte.id_reporte)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                      {reporte.descripcion || 'Sin descripción disponible'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                        <StatusIcon className="inline w-3 h-3 mr-1" />
                        {reporte.estado}
                      </span>
                    </div>
                  </div>
                  
                  {/* Compact Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    {reporte.usuario && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          {`${reporte.usuario.nombres?.split(' ')[0] || ''} ${reporte.usuario.apellidos?.split(' ')[0] || ''}`.trim() || 'Usuario'}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(reporte.fecha_hora).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-700">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{reporte.nombre_area || 'Sin área'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-purple-700">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">{reporte.nombre_obra || 'Sin obra'}</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Image */}
                {reporte.imagen_url && (
                  <div className="ml-6 flex-shrink-0">
                    <img 
                      src={reporte.imagen_url} 
                      alt="Evidencia del reporte" 
                      className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                      onClick={() => onView(reporte.id_reporte)}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium text-sm border border-transparent hover:border-blue-200 group/btn"
                  title="Ver detalles completos"
                  onClick={() => onView(reporte.id_reporte)}
                >
                  <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                  Ver
                </button>
                
                {onEdit && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300 font-medium text-sm border border-transparent hover:border-emerald-200 group/btn"
                    title="Editar información del reporte"
                    onClick={() => onEdit(reporte.id_reporte)}
                  >
                    <Pencil size={16} className="group-hover/btn:scale-110 transition-transform" />
                    Editar
                  </button>
                )}
                
                {onDelete && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 font-medium text-sm border border-transparent hover:border-red-200 group/btn"
                    title="Eliminar reporte permanentemente"
                    onClick={() => onDelete(reporte.id_reporte)}
                  >
                    <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportList;