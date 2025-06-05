import React, { useState, useMemo } from 'react'; // Agregamos useMemo aquí
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart3, Building2, AlertTriangle, CheckCircle2, FileText, Hourglass, User, Clock, MapPin, Building, Search, Calendar, X, ClipboardList } from 'lucide-react';
import type { Area } from '../../types/entities';
import EmptyState from './sharedStats/EmptyState';

const COLORS = {
  primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  danger: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
};

const EstadisticasReportes = ({ stats }: { stats: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  // Cálculos de estadísticas
  const totalReportes = stats.totalReportes || 0;
  const reportesPendientes = stats.reportesPorEstado?.pendiente || 0;
  const reportesCerrados = stats.reportesPorEstado?.cerrado || 0;
  const reportesRevision = stats.reportesPorEstado?.['en revisión'] || 0;
  const tasaResolucion = totalReportes ? ((reportesCerrados / totalReportes) * 100).toFixed(1) : '0';

  // Datos para gráficos
  const dataPorEstado = Object.entries(stats.reportesPorEstado || {}).map(([estado, cantidad]) => ({
    name: estado,
    value: cantidad as number
  }));

  const dataPorObra = stats.misObras?.map((obra: any) => {
    // Primero obtenemos las áreas de la obra
    const areasDeObra = stats.areasDeMisObras.filter(
      (a: any) => a.id_obra === obra.id_obra
    );
    
    // Luego obtenemos los reportes que corresponden a esas áreas
    const reportesDeObra = stats.reportesDeMisObras.filter((r: any) => 
      areasDeObra.some((area: Area) => area.id_area === r.id_area)
    );

    return {
      name: obra.nombre,
      total: reportesDeObra.length,
      pendientes: reportesDeObra.filter((r: any) => r.estado === 'pendiente').length
    };
  }) || [];

  const dataPorSupervisor = stats.reportesPorSupervisor?.map((item: any) => ({
    name: `${item.supervisor.nombres} ${item.supervisor.apellidos}`,
    total: item.total
  })) || [];

  // Modificar el filtrado para incluir los nuevos filtros
  const filteredReportes = useMemo(() => {
    return stats.reportesDeMisObras?.filter((reporte: any) => {
      const searchString = searchTerm.toLowerCase();
      const matchesSearch = 
        reporte.usuario?.nombres?.toLowerCase().includes(searchString) ||
        reporte.usuario?.apellidos?.toLowerCase().includes(searchString) ||
        reporte.nombre_area?.toLowerCase().includes(searchString) ||
        reporte.nombre_obra?.toLowerCase().includes(searchString);

      const matchesStatus = statusFilter === 'all' || reporte.estado === statusFilter;

      const reporteDate = new Date(reporte.fecha_hora);
      const matchesDate = 
        (!dateFilter.startDate || reporteDate >= new Date(dateFilter.startDate)) &&
        (!dateFilter.endDate || reporteDate <= new Date(dateFilter.endDate));

      return matchesSearch && matchesStatus && matchesDate;
    }) || [];
  }, [stats.reportesDeMisObras, searchTerm, statusFilter, dateFilter]);

  return (
    <section className="space-y-8">
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-blue-400/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 group-hover:text-blue-400 transition-colors duration-300">{totalReportes}</p>
              <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Total Reportes</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-400">
            <BarChart3 className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">en total</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 group-hover:text-amber-500 transition-colors duration-300">{reportesPendientes}</p>
              <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Pendientes</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-amber-500">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">por resolver</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Hourglass className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{reportesRevision}</p>
              <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">En Revisión</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600">
            <Hourglass className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">en revisión</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">{reportesCerrados}</p>
              <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Resueltos</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-emerald-600">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">completados</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{tasaResolucion}%</p>
              <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Tasa Resolución</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-indigo-600">
            <Building2 className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">promedio</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Estado de reportes - Solo gráfico circular */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Estado de Reportes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataPorEstado}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                label
              >
                {dataPorEstado.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Reportes por obra */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Reportes por Obra</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPorObra}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="total" name="Total Reportes" fill={COLORS.primary[0]} />
              <Bar dataKey="pendientes" name="Pendientes" fill={COLORS.warning[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de últimos reportes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-blue-500/50 hover:bg-blue-100 transition-all duration-300 ease-in-out cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
              <FileText 
                className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" 
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors duration-300">
                Últimos Reportes
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 mt-1">
                Documentos y análisis más recientes
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap"> Buscar: </span>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Obra, área, usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70"
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
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap"> Estado: </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-48 py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en revisión">En Revisión</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap"> Rango de fecha: </span>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))
                  }
                  className="w-auto py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))
                  }
                  className="w-auto py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center px-3 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-600">
                <span className="font-semibold">{filteredReportes.length}</span> reporte{filteredReportes.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto xl:overflow-visible m-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-10">
              <tr>
                <th className="px-10 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-10 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">
                  Obra
                </th>
                <th className="px-10 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-10 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-10 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">
                  Usuario
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredReportes.length > 0 ? (
                filteredReportes.slice(0, 5).map((reporte: any) => (
                  <tr key={reporte.id_reporte} className="group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/date rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover/date:bg-gray-200 transition-all duration-300">
                          <Calendar className="h-3.5 w-3.5 text-gray-500 group-hover/date:text-gray-700" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 group-hover/date:text-gray-700">
                            {format(new Date(reporte.fecha_hora), 'dd/MM/yyyy', { locale: es })}
                          </span>
                          <span className="text-xs text-gray-500 group-hover/date:text-gray-600">
                            {format(new Date(reporte.fecha_hora), 'HH:mm', { locale: es })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/obra rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover/obra:bg-purple-200 transition-all duration-300">
                          <Building className="h-3.5 w-3.5 text-purple-600 group-hover/obra:text-purple-700" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 group-hover/obra:text-purple-700 transition-colors duration-300">
                          {reporte.nombre_obra}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/area rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center group-hover/area:bg-green-200 transition-all duration-300">
                          <MapPin className="h-3.5 w-3.5 text-green-600 group-hover/area:text-green-700" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 group-hover/area:text-green-700 transition-colors duration-300">
                          {reporte.nombre_area}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reporte.estado === 'pendiente' && (
                        <div className="group/estado inline-block">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-300 bg-amber-50 text-amber-800 group-hover/estado:bg-amber-100 group-hover/estado:border-amber-400 group-hover/estado:text-amber-900 transition-all duration-300 cursor-pointer">
                            <Clock className="h-3 w-3" />
                            Pendiente
                          </span>
                        </div>
                      )}
                      {reporte.estado === 'en revisión' && (
                        <div className="group/estado inline-block">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-300 bg-blue-50 text-blue-800 group-hover/estado:bg-blue-100 group-hover/estado:border-blue-400 group-hover/estado:text-blue-900 transition-all duration-300 cursor-pointer">
                            <Search className="h-3 w-3" />
                            En Revisión
                          </span>
                        </div>
                      )}
                      {reporte.estado === 'cerrado' && (
                        <div className="group/estado inline-block">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-300 bg-emerald-50 text-emerald-800 group-hover/estado:bg-emerald-100 group-hover/estado:border-emerald-400 group-hover/estado:text-emerald-900 transition-all duration-300 cursor-pointer">
                            <CheckCircle2 className="h-3 w-3" />
                            Cerrado
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/user rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover/user:bg-blue-200 transition-all duration-300">
                          <User className="h-3.5 w-3.5 text-blue-600 group-hover/user:text-blue-700" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 group-hover/user:text-blue-800 transition-colors duration-300">
                            {reporte.usuario?.nombres} {reporte.usuario?.apellidos}
                          </span>
                          <span className="text-xs text-blue-400 group-hover/user:text-blue-900 font-medium">
                            {reporte.usuario?.global_role}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState 
                      title="No hay reportes disponibles"
                      message="No se encontraron reportes que coincidan con los filtros seleccionados."
                      icon={<ClipboardList className="w-16 h-16" />}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EstadisticasReportes;