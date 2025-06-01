import React from 'react';
import type { ReporteResumen } from '../../types/entities';
import { Pencil, Trash2, Eye, User, MapPin, Building, Calendar, AlertCircle, Clock, CheckCircle2, Pause, X, Search } from 'lucide-react';

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
  isLoading,
  error
}) => {
  const getStatusConfig = (estado: string) => {
    const configs = {
      'pendiente': { 
        color: 'text-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-sm', 
        icon: Clock,
        badge: 'bg-amber-500'
      },
      'en revisión': { 
        color: 'text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-sm', 
        icon: Search,
        badge: 'bg-blue-500'
      },
      'cerrado': { 
        color: 'text-emerald-800 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 shadow-sm', 
        icon: CheckCircle2,
        badge: 'bg-emerald-500'
      },
    };
    return configs[estado as keyof typeof configs] || configs['pendiente'];
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4">Cargando reportes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!reportes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Building className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin reportes disponibles</h3>
        <p className="text-gray-500">Los reportes aparecerán aquí una vez que se generen</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase">
          <div className="col-span-1">Estado</div>
          <div className="col-span-3">Descripción</div>
          <div className="col-span-2">Usuario</div>
          <div className="col-span-2">Ubicación</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-1">Evidencia</div>
          <div className="col-span-1">Acciones</div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {reportes.map((reporte) => {
          const statusConfig = getStatusConfig(reporte.estado);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div
              key={reporte.id_reporte}
              className="px-6 py-4 hover:bg-orange-50 transition-colors duration-150"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Estado */}
                <div className="col-span-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {reporte.estado}
                  </span>
                </div>

                {/* Descripción */}
                <div className="col-span-3">
                  <button
                    onClick={() => onView(reporte.id_reporte)}
                    className="text-left hover:text-blue-600 transition-colors"
                  >
                    <p className="font-medium text-gray-900 text-sm line-clamp-2">
                      {reporte.descripcion || 'Sin descripción'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">ID: {reporte.id_reporte}</p>
                  </button>
                </div>

                {/* Usuario */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {reporte.usuario ? 
                          `${reporte.usuario.nombres?.split(' ')[0] || ''} ${reporte.usuario.apellidos?.split(' ')[0] || ''}`.trim() || 'Usuario'
                          : 'Sin asignar'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="col-span-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-gray-700">{reporte.nombre_area || 'Sin área'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-purple-600" />
                      <span className="text-xs text-gray-700">{reporte.nombre_obra || 'Sin obra'}</span>
                    </div>
                  </div>
                </div>

                {/* Fecha */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-900">
                        {new Date(reporte.fecha_hora).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(reporte.fecha_hora).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Imagen */}
                <div className="col-span-1">
                  {reporte.imagen_url ? (
                    <img 
                      src={reporte.imagen_url} 
                      alt="Evidencia" 
                      className="w-10 h-10 object-cover rounded-lg  cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => onView(reporte.id_reporte)}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-400">N/A</span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="col-span-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onView(reporte.id_reporte)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Ver"
                    >
                      <Eye size={16} />
                    </button>
                    
                    {onEdit && (
                      <button
                        onClick={() => onEdit(reporte.id_reporte)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    
                    {onDelete && (
                      <button
                        onClick={() => onDelete(reporte.id_reporte)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {reportes.length} reporte{reportes.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default ReportList;