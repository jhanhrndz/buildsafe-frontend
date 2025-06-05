import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users, AlertTriangle, CheckCircle2, FileText, Calendar, Activity, Search, X, LayoutGrid } from 'lucide-react';
import EmptyState from './sharedStats/EmptyState';

const COLORS = {
  primary: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
  secondary: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
};

const EstadisticasSupervisores = ({ stats }: { stats: any }) => {
  // Estadísticas generales
  const totalSupervisores = stats.supervisoresDeMisObras.length;
  const supervisoresActivos = stats.supervisoresDeMisObras.filter(
    (s: any) => s.areas?.length > 0
  ).length;
  const totalAreasSupervisadas = stats.supervisoresDeMisObras.reduce(
    (acc: number, s: any) => acc + (s.areas?.length || 0), 0
  );
  const promedioAreasXSupervisor = totalSupervisores ? 
    (totalAreasSupervisadas / totalSupervisores).toFixed(1) : '0';

  // Datos para gráficos
  const dataPorReportes = stats.supervisoresStats?.map((supervisor: any) => ({
    name: `${supervisor.nombres} ${supervisor.apellidos}`,
    total: supervisor.totalReportes,
    pendientes: supervisor.reportesPendientes
  })).sort((a: any, b: any) => b.total - a.total);

  const dataPorAreas = stats.supervisoresStats?.map((supervisor: any) => ({
    name: `${supervisor.nombres} ${supervisor.apellidos}`,
    areas: supervisor.totalAreas
  })).sort((a: any, b: any) => b.areas - a.areas);

  // Agregar estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [quantityFilter, setQuantityFilter] = useState({
    type: 'none',
    value: ''
  });
  // Agregar o modificar el estado de fecha
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  // Agregar lógica de filtrado
  const filteredSupervisores = useMemo(() => {
    return stats.supervisoresStats?.filter((supervisor: any) => {
      const searchString = searchTerm.toLowerCase();
      const matchesSearch = 
        `${supervisor.nombres} ${supervisor.apellidos}`.toLowerCase().includes(searchString) ||
        supervisor.correo?.toLowerCase().includes(searchString);

      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'activo' && supervisor.totalAreas > 0) ||
        (statusFilter === 'inactivo' && supervisor.totalAreas === 0);

      const matchesQuantity = () => {
        if (quantityFilter.type === 'none' || !quantityFilter.value) return true;
        const value = parseInt(quantityFilter.value);
        if (isNaN(value)) return true;

        switch (quantityFilter.type) {
          case 'areas': return supervisor.totalAreas === value;
          case 'reportes': return supervisor.totalReportes === value;
          case 'pendientes': return supervisor.reportesPendientes === value;
          default: return true;
        }
      };

      const matchesDates = () => {
        if (!dateFilter.startDate && !dateFilter.endDate) return true;
        if (!supervisor.ultimoReporte) return false;

        const reporteDate = new Date(supervisor.ultimoReporte);
        const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
        const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

        return (!startDate || reporteDate >= startDate) &&
               (!endDate || reporteDate <= endDate);
      };

      return matchesSearch && matchesStatus && matchesQuantity() && matchesDates();
    }) || [];
  }, [stats.supervisoresStats, searchTerm, statusFilter, quantityFilter, dateFilter]);

  return (
    <section className="space-y-8">
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{totalSupervisores}</p>
              <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Total Supervisores</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-indigo-600">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">{supervisoresActivos} activos</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <LayoutGrid className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">{totalAreasSupervisadas}</p>
              <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Áreas Supervisadas</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-emerald-600">
            <LayoutGrid className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">{promedioAreasXSupervisor} promedio</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                {stats.supervisoresStats?.reduce((acc: number, s: any) => acc + s.totalReportes, 0) || 0}
              </p>
              <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Reportes Totales</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-amber-600">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">generados</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-rose-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 group-hover:text-rose-600 transition-colors duration-300">
                {stats.supervisoresStats?.reduce((acc: number, s: any) => acc + s.reportesPendientes, 0) || 0}
              </p>
              <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Reportes Pendientes</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-rose-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">por resolver</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Reportes por supervisor */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Reportes por Supervisor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPorReportes}>
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

        {/* Áreas por supervisor */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Áreas por Supervisor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPorAreas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="areas" name="Áreas Asignadas" fill={COLORS.secondary[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
        <div className="px-6 py-5 border-b border-gray-200 bg-blue-500/50 hover:bg-blue-100 transition-all duration-300 ease-in-out cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
              <Users 
                className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" 
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors duration-300">
                Detalle de Supervisores
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 mt-1">
                Listado completo de supervisores y sus estadísticas
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Buscar:</span>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Nombre o correo del supervisor..."
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
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Estado:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-48 py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Sin áreas</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Fecha:</span>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-32 py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-32 py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Quantity Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Cantidad:</span>
              <div className="flex gap-2">
                <select
                  value={quantityFilter.type}
                  onChange={(e) => setQuantityFilter(prev => ({ ...prev, type: e.target.value }))}
                  className="w-40 py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="none">Seleccionar...</option>
                  <option value="areas">Áreas asignadas</option>
                  <option value="reportes">Total reportes</option>
                  <option value="pendientes">Reportes pendientes</option>
                </select>
                <input
                  type="number"
                  min="0"
                  value={quantityFilter.value}
                  onChange={(e) => setQuantityFilter(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="#"
                  className="w-20 py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center px-3 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-600">
                <span className="font-semibold">{filteredSupervisores.length}</span> supervisor{filteredSupervisores.length !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto xl:overflow-visible m-4">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-10">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-6 py-5 text-center text-sm font-black text-gray-800 uppercase tracking-wider">
                  Áreas Asignadas
                </th>
                <th className="px-6 py-5 text-center text-sm font-black text-gray-800 uppercase tracking-wider">
                  Reportes
                </th>
                <th className="px-6 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">
                  Último Reporte
                </th>
                <th className="px-6 py-5 text-center text-sm font-black text-gray-800 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSupervisores.length > 0 ? (
                filteredSupervisores.map((supervisor: any) => (
                  <tr key={supervisor.id_usuario} className="group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/user rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover/user:bg-indigo-200 transition-all duration-300">
                          <Users className="h-3.5 w-3.5 text-indigo-600 group-hover/user:text-indigo-700" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 group-hover/user:text-indigo-700">
                            {supervisor.nombres} {supervisor.apellidos}
                          </span>
                          <span className="text-xs text-gray-500 group-hover/user:text-indigo-600">
                            {supervisor.correo}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 group/areas rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover/areas:bg-emerald-200 transition-all duration-300">
                            <LayoutGrid className="h-3.5 w-3.5 text-emerald-600 group-hover/areas:text-emerald-700" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-gray-900 group-hover/areas:text-emerald-700">
                              {supervisor.totalAreas}
                            </span>
                            <span className="text-xs text-emerald-500 group-hover/areas:text-emerald-600">
                              asignadas
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 group/reports rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center group-hover/reports:bg-rose-200 transition-all duration-300">
                            <FileText className="h-3.5 w-3.5 text-rose-600 group-hover/reports:text-rose-700" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover/reports:text-rose-700">
                            {supervisor.totalReportes}
                          </span>
                        </div>
                        {supervisor.reportesPendientes > 0 && (
                          <span className="text-xs text-rose-500 group-hover/reports:text-rose-600">
                            {supervisor.reportesPendientes} pendientes
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/date rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center group-hover/date:bg-amber-200 transition-all duration-300">
                          <Calendar className="h-3.5 w-3.5 text-amber-600 group-hover/date:text-amber-700" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 group-hover/date:text-amber-700">
                          {supervisor.ultimoReporte 
                            ? format(new Date(supervisor.ultimoReporte), 'dd/MM/yyyy HH:mm', { locale: es })
                            : 'Sin reportes'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <div className="group/estado inline-block">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
                            ${supervisor.totalAreas > 0 
                              ? 'border border-green-300 bg-green-50 text-green-800 group-hover/estado:bg-green-100 group-hover/estado:border-green-400 group-hover/estado:text-green-900' 
                              : 'border border-gray-300 bg-gray-50 text-gray-800 group-hover/estado:bg-gray-100 group-hover/estado:border-gray-400 group-hover/estado:text-gray-900'}`}
                          >
                            <Activity className="h-3 w-3" />
                            {supervisor.totalAreas > 0 ? 'Activo' : 'Sin áreas'}
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
                      title="No hay supervisores disponibles"
                      message="No se encontraron supervisores que coincidan con los filtros seleccionados."
                      icon={<Users className="w-16 h-16" />}
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

export default EstadisticasSupervisores;