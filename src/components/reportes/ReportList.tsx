import React, { useState, useMemo } from 'react';
import type { ReporteResumen } from '../../types/entities';
import { Pencil, Trash2, Eye, User, MapPin, Building, Calendar, AlertCircle, Clock, CheckCircle2, Pause, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';

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
  itemsPerPage?: number;
}

const ReportList: React.FC<ReportListProps> = ({
  reportes,
  onView,
  onEdit,
  onDelete,
  isLoading,
  error,
  itemsPerPage = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtrado y búsqueda
  const filteredReportes = useMemo(() => {
    return reportes.filter(reporte => {
      const matchesSearch = 
        (reporte.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        reporte.id_reporte.toString().includes(searchTerm) ||
        (reporte.usuario?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (reporte.usuario?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (reporte.nombre_area?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (reporte.nombre_obra?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesStatus = statusFilter === 'all' || reporte.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reportes, searchTerm, statusFilter]);

  // Paginación
  const totalPages = Math.ceil(filteredReportes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReportes = filteredReportes.slice(startIndex, startIndex + itemsPerPage);

  // Reset página cuando cambia la búsqueda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };
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
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-xl font-bold text-orange-600">Cargando reportes...</p>
            <p className="text-gray-500">Obteniendo información de los reportes</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative rounded-2xl border border-red-200/50 bg-gradient-to-r from-red-50/80 to-red-100/30 backdrop-blur-sm p-8 shadow-sm transform hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-red-800 mb-2 text-lg">Error al cargar reportes</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden transform transition-all duration-500">
      {/* Search and Filter Section - Always visible */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por descripción, ID, usuario, área u obra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">Filtrar por estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/70 backdrop-blur-sm text-sm"
            >
              <option value="all">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en revisión">En Revisión</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>

          {/* Results Counter */}
          <div className="text-sm text-gray-600 bg-white/50 px-3 py-2 rounded-lg">
            <span className="font-semibold">{filteredReportes.length}</span> reporte{filteredReportes.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        <div className="divide-y divide-gray-100">
          {/* Desktop Table Header - Distribución mejorada */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2">Estado</div>
            <div className="col-span-3">Descripción</div>
            <div className="col-span-2">Usuario</div>
            <div className="col-span-2">Ubicación</div>
            <div className="col-span-2">Fecha</div>
            <div className="col-span-1">Acciones</div>
          </div>

          {/* Table Rows */}
          {paginatedReportes.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No se encontraron reportes' : 'No hay reportes disponibles'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'Los reportes aparecerán aquí cuando estén disponibles'
                }
              </p>
            </div>
          ) : (
            paginatedReportes.map((reporte, index) => {
            const statusConfig = getStatusConfig(reporte.estado);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={reporte.id_reporte}
                className="group hover:bg-orange-50/50 transition-all duration-300 rounded-2xl"
                style={{ 
                  animation: `fadeInUp 0.5s ease-out`,
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Desktop Layout - Distribución mejorada */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-4 py-8 items-center">
                  {/* Estado - col-span-2 */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {reporte.estado}
                    </span>
                  </div>

                  {/* Descripción - col-span-3 (más espacio) */}
                  <div className="col-span-3">
                    <button
                      onClick={() => onView(reporte.id_reporte)}
                      className="text-left hover:text-orange-600 transition-colors duration-300 w-full"
                    >
                      <h4 className="font-bold text-gray-900 text-base group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                        {reporte.descripcion || 'Sin descripción'}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">ID: {reporte.id_reporte}</p>
                    </button>
                  </div>

                  {/* Usuario - col-span-2 */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {reporte.usuario ? 
                            `${reporte.usuario.nombres?.split(' ')[0] || ''} ${reporte.usuario.apellidos?.split(' ')[0] || ''}`.trim() || 'Usuario'
                            : 'Sin asignar'
                          }
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Ubicación - col-span-2 */}
                  <div className="col-span-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">{reporte.nombre_area || 'Sin área'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-purple-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">{reporte.nombre_obra || 'Sin obra'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fecha y Evidencia - col-span-2 */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 block">
                          {new Date(reporte.fecha_hora).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(reporte.fecha_hora).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {/* Evidencia integrada */}
                      {reporte.imagen_url ? (
                        <img 
                          src={reporte.imagen_url} 
                          alt="Evidencia" 
                          className="w-10 h-10 object-cover rounded-xl shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300 border border-gray-200"
                          onClick={() => onView(reporte.id_reporte)}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                          <span className="text-xs text-gray-400 font-medium">N/A</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones - col-span-1 */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onView(reporte.id_reporte)}
                        className="group/btn p-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                        title="Ver reporte"
                      >
                        <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                      </button>
                      
                      {onEdit && (
                        <button
                          onClick={() => onEdit(reporte.id_reporte)}
                          className="group/btn p-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                          title="Editar reporte"
                        >
                          <Pencil className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                        </button>
                      )}
                      
                      {onDelete && (
                        <button
                          onClick={() => onDelete(reporte.id_reporte)}
                          className="group/btn p-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                          title="Eliminar reporte"
                        >
                          <Trash2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Mobile Layout */}
                <div className="lg:hidden px-6 py-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-lg">
                      <Building className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <button
                          onClick={() => onView(reporte.id_reporte)}
                          className="text-left hover:text-orange-600 transition-colors flex-1"
                        >
                          <h4 className="font-black text-gray-900 text-lg line-clamp-2">
                            {reporte.descripcion || 'Sin descripción'}
                          </h4>
                        </button>
                        <span className={`inline-flex items-center gap-1 rounded-xl px-3 py-1 text-xs font-bold border ${statusConfig.color} ml-2`}>
                          <StatusIcon className="w-3 h-3" />
                          {reporte.estado}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500">ID: {reporte.id_reporte}</div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {reporte.usuario ? 
                              `${reporte.usuario.nombres?.split(' ')[0] || ''} ${reporte.usuario.apellidos?.split(' ')[0] || ''}`.trim() || 'Usuario'
                              : 'Sin asignar'
                            }
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{reporte.nombre_area || 'Sin área'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                              <Building className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{reporte.nombre_obra || 'Sin obra'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700 block">
                              {new Date(reporte.fecha_hora).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(reporte.fecha_hora).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        {reporte.imagen_url && (
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Evidencia:</span>
                            <img 
                              src={reporte.imagen_url} 
                              alt="Evidencia" 
                              className="w-16 h-16 object-cover rounded-xl shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300 border border-gray-200"
                              onClick={() => onView(reporte.id_reporte)}
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => onView(reporte.id_reporte)}
                            className="group/btn inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition-all duration-300 hover:bg-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md"
                          >
                            <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                            Ver reporte
                          </button>
                          
                          {onEdit && (
                            <button
                              onClick={() => onEdit(reporte.id_reporte)}
                              className="group/btn inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md"
                            >
                              <Pencil className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                              Editar
                            </button>
                          )}
                          
                          {onDelete && (
                            <button
                              onClick={() => onDelete(reporte.id_reporte)}
                              className="group/btn inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition-all duration-300 hover:bg-red-100 hover:border-red-300 shadow-sm hover:shadow-md"
                            >
                              <Trash2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                              Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }))}
          
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ReportList;