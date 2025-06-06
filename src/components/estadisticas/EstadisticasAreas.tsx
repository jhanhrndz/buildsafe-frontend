import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LayoutGrid, Camera, Users, AlertTriangle, X, Search, Calendar, FileText, User, Building } from 'lucide-react';
import type { Obra, Area, User as Supervisor, Camara, ReporteResumen } from '../../types/entities';
import EmptyState from './sharedStats/EmptyState';

const COLORS = {
  primary: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
  secondary: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  accent: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
};

// Interfaces para el componente
interface EstadisticasAreasProps {
  stats: {
    misObras: Obra[];
    areasDeMisObras: Area[];
    supervisoresDeMisObras: Supervisor[];
    camaras: Camara[];
    reportesDeMisObras: ReporteResumen[];
  };
}

// Interfaz para estadísticas detalladas de área
interface EstadisticaArea extends Area {
  nombreObra: string;
  supervisor: string;
  totalCamaras: number;
  camarasActivas: number;
  totalReportes: number;
  reportesPendientes: number;
  ultimoReporte: number | null;
}

// Interfaz para datos del gráfico
interface AreaPorObra {
  name: string;
  areas: number;
  reportes: number;
}

const EstadisticasAreas = ({ stats }: EstadisticasAreasProps) => {
  const [obraFiltrada, setObraFiltrada] = useState<number | 'todas'>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: ''});
  const [quantityFilter, setQuantityFilter] = useState({ type: 'none', value: ''});


  // Estadísticas generales
  const totalAreas = stats.areasDeMisObras.length;
  const areasConSupervisor = stats.areasDeMisObras.filter((a: Area) => a.id_usuario).length;
  const areasConCamaras = stats.areasDeMisObras.filter((a: Area) => 
    stats.camaras.some((c: Camara) => c.id_area === a.id_area)
  ).length;
  const areasConReportes = stats.areasDeMisObras.filter((a: Area) =>
    stats.reportesDeMisObras.some((r: ReporteResumen) => r.id_area === a.id_area)
  ).length;

  // Calcular estadísticas detalladas por área
  const estadisticasArea: EstadisticaArea[] = stats.areasDeMisObras.map((area: Area) => {
    const obra = stats.misObras.find((o: Obra) => o.id_obra === area.id_obra);
    const supervisor = stats.supervisoresDeMisObras.find((s: any) => 
      s.areas.some((a: Area) => a.id_area === area.id_area)
    );
    const camaras = stats.camaras.filter((c: Camara) => c.id_area === area.id_area);
    const reportes = stats.reportesDeMisObras.filter((r: ReporteResumen) => r.id_area === area.id_area);
    const reportesPendientes = reportes.filter(r => r.estado === 'pendiente');

    return {
      ...area,
      nombreObra: obra?.nombre || 'Sin obra',
      supervisor: supervisor ? `${supervisor.nombres} ${supervisor.apellidos}` : 'Sin asignar',
      totalCamaras: camaras.length,
      camarasActivas: camaras.filter(c => c.estado === 'activa').length,
      totalReportes: reportes.length,
      reportesPendientes: reportesPendientes.length,
      ultimoReporte: reportes.length > 0 ? Math.max(...reportes.map(r => new Date(r.fecha_hora).getTime())) : null
    };
  });

  // Datos para gráficos
  const dataAreasPorObra: AreaPorObra[] = stats.misObras
    .filter((obra: Obra) => obraFiltrada === 'todas' || obra.id_obra === obraFiltrada)
    .map((obra: Obra) => {
      const areasDeObra = stats.areasDeMisObras.filter(a => a.id_obra === obra.id_obra);
      return {
        name: obra.nombre,
        areas: areasDeObra.length,
        reportes: stats.reportesDeMisObras.filter(r => 
          areasDeObra.some(area => area.id_area === r.id_area)
        ).length
      };
    });

  // Filtrado de áreas
  const filteredAreas = useMemo(() => {
    return estadisticasArea.filter((area: EstadisticaArea) => {
      const searchString = searchTerm.toLowerCase();
      const matchesSearch = 
        area.nombre?.toLowerCase().includes(searchString) ||
        area.descripcion?.toLowerCase().includes(searchString) ||
        area.nombreObra?.toLowerCase().includes(searchString) ||
        area.supervisor?.toLowerCase().includes(searchString);

      const matchesSupervisor = statusFilter === 'all' || 
        (statusFilter === 'con-supervisor' && area.supervisor !== 'Sin asignar') ||
        (statusFilter === 'sin-supervisor' && area.supervisor === 'Sin asignar');

      // Corregir la función matchesQuantity
      const matchesQuantity = () => {
        if (quantityFilter.type === 'none' || !quantityFilter.value) return true;
        
        const filterValue = parseInt(quantityFilter.value);
        if (isNaN(filterValue)) return true;

        switch (quantityFilter.type) {
          case 'camaras':
            return area.totalCamaras === filterValue;
          case 'camarasActivas':
            return area.camarasActivas === filterValue;
          case 'reportes':
            return area.totalReportes === filterValue;
          default:
            return true;
        }
      };

      const matchesDates = () => {
        if (!dateFilter.startDate && !dateFilter.endDate) return true;
        if (!area.ultimoReporte) return false;

        const reporteDate = new Date(area.ultimoReporte);
        const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
        const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

        return (!startDate || reporteDate >= startDate) && (!endDate || reporteDate <= endDate);
      };

      return matchesSearch && matchesSupervisor && matchesQuantity() && matchesDates();
    }).filter((area: EstadisticaArea) => 
      obraFiltrada === 'todas' || area.id_obra === obraFiltrada
    );
  }, [estadisticasArea, searchTerm, statusFilter, quantityFilter, dateFilter, obraFiltrada]);


  return (
    <section className="space-y-8">
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <LayoutGrid className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{totalAreas}</p>
          <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Total Áreas</p>
        </div>
          </div>
          <div className="mt-4 flex items-center text-indigo-600">
        <LayoutGrid className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">{stats.misObras.length} obras registradas</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">{areasConSupervisor}</p>
          <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Con Supervisor</p>
        </div>
          </div>
          <div className="mt-4 flex items-center text-emerald-600">
        <Users className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">{totalAreas - areasConSupervisor} sin asignar</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Camera className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 group-hover:text-amber-600 transition-colors duration-300">{areasConCamaras}</p>
          <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Con Cámaras</p>
        </div>
          </div>
          <div className="mt-4 flex items-center text-amber-600">
        <Camera className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">{totalAreas - areasConCamaras} sin cámaras</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-rose-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <AlertTriangle className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 group-hover:text-rose-600 transition-colors duration-300">{areasConReportes}</p>
          <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Con Reportes</p>
        </div>
          </div>
          <div className="mt-4 flex items-center text-rose-600">
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">{totalAreas - areasConReportes} sin reportes</span>
          </div>
        </div>
      </div>

      {/* Filtro por obra */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <select
          className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-200"
          value={obraFiltrada}
          onChange={(e) => setObraFiltrada(e.target.value === 'todas' ? 'todas' : Number(e.target.value))}
        >
          <option value="todas">Todas las obras</option>
          {stats.misObras.map((obra: any) => (
            <option key={obra.id_obra} value={obra.id_obra}>
              {obra.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Áreas y reportes por obra */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Distribución por Obra</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataAreasPorObra}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="areas" fill="#6366f1" name="Áreas" />
              <Bar dataKey="reportes" fill="#ef4444" name="Reportes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estado de áreas */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Estado de Áreas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Con Supervisor', value: areasConSupervisor },
                  { name: 'Sin Supervisor', value: totalAreas - areasConSupervisor },
                  { name: 'Con Cámaras', value: areasConCamaras },
                  { name: 'Sin Cámaras', value: totalAreas - areasConCamaras }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                label
              >
                {[0, 1, 2, 3].map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
        <div className="px-6 py-5 border-b border-gray-200 bg-blue-500/50 hover:bg-blue-100 transition-all duration-300 ease-in-out cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
              <LayoutGrid 
                className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" 
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors duration-300">
                Detalle de Áreas
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 mt-1">
                Listado completo de áreas y sus métricas
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Buscar:</span>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, descripción, obra o supervisor..."
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
                <option value="con-supervisor">Con Supervisor</option>
                <option value="sin-supervisor">Sin Supervisor</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Rango de fecha:</span>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-auto py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-auto py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                  <option value="camaras">Total Cámaras</option>
                  <option value="camarasActivas">Cámaras Activas</option>
                  <option value="reportes">Total Reportes</option>
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
                <span className="font-semibold">{filteredAreas.length}</span> área{filteredAreas.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto xl:overflow-visible m-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-10">
              <tr>
                <th className="px-8 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">Área</th>
                <th className="px-8 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">Obra</th>
                <th className="px-8 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">Supervisor</th>
                <th className="px-8 py-5 text-center text-sm font-black text-gray-800 uppercase tracking-wider">Cámaras</th>
                <th className="px-8 py-5 text-center text-sm font-black text-gray-800 uppercase tracking-wider">Reportes</th>
                <th className="px-8 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">Último Reporte</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAreas.length > 0 ? (
                filteredAreas.map((area: EstadisticaArea) => (
                  <tr key={area.id_area} className="group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 group/area rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover/area:bg-indigo-200 transition-all duration-300">
                        <LayoutGrid className="h-3.5 w-3.5 text-indigo-600 group-hover/area:text-indigo-700" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 group-hover/area:text-indigo-700">{area.nombre}</span>
                        <span className="text-xs text-gray-500 group-hover/area:text-indigo-600">{area.descripcion}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 group/obra rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover/obra:bg-purple-200 transition-all duration-300">
                        <Building className="h-3.5 w-3.5 text-purple-600 group-hover/obra:text-purple-700" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 group-hover/obra:text-purple-700">{area.nombreObra}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 group/supervisor rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover/supervisor:bg-emerald-200 transition-all duration-300">
                        <User className="h-3.5 w-3.5 text-emerald-600 group-hover/supervisor:text-emerald-700" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 group-hover/supervisor:text-emerald-700">{area.supervisor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 group/cameras rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover/cameras:bg-blue-200 transition-all duration-300">
                          <Camera className="h-3.5 w-3.5 text-blue-600 group-hover/cameras:text-blue-700" />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium text-gray-900 group-hover/cameras:text-blue-700">{area.totalCamaras}</span>
                          <span className="text-xs text-green-500 group-hover/cameras:text-blue-600">{area.camarasActivas} activas</span>
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
                        <span className="text-sm font-medium text-gray-900 group-hover/reports:text-rose-700">{area.totalReportes}</span>
                      </div>
                      {area.reportesPendientes > 0 && (
                        <span className="text-xs text-rose-500 group-hover/reports:text-rose-600">{area.reportesPendientes} pendientes</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 group/date rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center group-hover/date:bg-amber-200 transition-all duration-300">
                        <Calendar className="h-3.5 w-3.5 text-amber-600 group-hover/date:text-amber-700" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 group-hover/date:text-amber-700">
                        {area.ultimoReporte 
                          ? format(new Date(area.ultimoReporte), 'dd/MM/yyyy HH:mm', { locale: es })
                          : 'Sin reportes'}
                      </span>
                    </div>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
      <td colSpan={6}>
        <EmptyState 
          title="No hay áreas disponibles"
          message="No se encontraron áreas que coincidan con los filtros seleccionados."
          icon={<LayoutGrid className="w-16 h-16" />}
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

export default EstadisticasAreas;