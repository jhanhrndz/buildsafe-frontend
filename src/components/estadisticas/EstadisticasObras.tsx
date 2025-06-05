import React, { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Users, Camera, FileText, LayoutGrid, Activity, Search, X,  Calendar, ClipboardList } from 'lucide-react';
import type { Obra, Area, User as Supervisor, Camara, ReporteResumen } from '../../types/entities';
import EmptyState from './sharedStats/EmptyState';

const COLORS = {
  primary: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
  state: {
    activo: '#10b981',
    inactivo: '#f59e0b',
    finalizado: '#6b7280'
  }
};

// Interfaz para las props del componente
interface EstadisticasObrasProps {
  stats: {
    misObras: Obra[];
    areasDeMisObras: Area[];
    supervisoresDeMisObras: Supervisor[];
    camaras: Camara[];
    reportesDeMisObras: ReporteResumen[];
    totalReportes: number;
  };
}

// Interfaz para los datos mensuales
interface DatoMensual {
  mes: string;
  obrasIniciadas: number;
  totalReportes: number;
  reportesPendientes: number;
  timestamp: number;
}

// Interfaz para estadísticas extendidas de obra
interface EstadisticaObra extends Obra {
  totalAreas: number;
  totalSupervisores: number;
  totalCamaras: number;
  totalReportes: number;
  reportesPendientes: number;
  created_at?: string;
}

const EstadisticasObras = ({ stats }: EstadisticasObrasProps) => {
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilters, setDateFilters] = useState({
    createdAt: '',
    startDate: ''
  });
  const [quantityFilter, setQuantityFilter] = useState({
    type: 'none',
    value: ''
  });

  // Estadísticas generales
  const totalObras = stats.misObras.length;
  const obrasActivas = stats.misObras.filter((o: Obra) => o.estado === 'activo').length;
  const totalAreas = stats.areasDeMisObras.length;
  const totalSupervisores = new Set(stats.supervisoresDeMisObras.map(s => s.id_usuario)).size;
  const totalCamaras = stats.camaras.length;

  // Obras por estado
  const obrasPorEstado = stats.misObras.reduce((acc: Record<string, number>, obra: Obra) => {
    acc[obra.estado] = (acc[obra.estado] || 0) + 1;
    return acc;
  }, {});

  // Modificar el cálculo de dataMensual
  const dataMensual: DatoMensual[] = stats.misObras
    // Primero creamos un punto de datos para cada mes desde la primera obra
    .reduce((acc: DatoMensual[], obra: Obra) => {
      const mesInicio = obra.fecha_inicio
        ? format(parseISO(obra.fecha_inicio), 'MMM yyyy', { locale: es })
        : 'Fecha desconocida';
      
      let existingMonth = acc.find(m => m.mes === mesInicio);
      if (!existingMonth) {
        existingMonth = {
          mes: mesInicio,
          obrasIniciadas: 0,
          totalReportes: 0,
          reportesPendientes: 0,
          timestamp: obra.fecha_inicio ? parseISO(obra.fecha_inicio).getTime() : 0
        };
        acc.push(existingMonth);
      }
      
      // Incrementar contador de obras iniciadas
      existingMonth.obrasIniciadas += 1;

      // Obtener reportes de esta obra
      const areasObra = stats.areasDeMisObras.filter(a => a.id_obra === obra.id_obra);
      const reportesObra = stats.reportesDeMisObras.filter(r => 
        areasObra.some(area => area.id_area === r.id_area)
      );

      // Agregar reportes al mes correspondiente
      reportesObra.forEach(reporte => {
        const mesReporte = format(parseISO(reporte.fecha_hora), 'MMM yyyy', { locale: es });
        let monthData = acc.find(m => m.mes === mesReporte);
        
        if (!monthData) {
          monthData = {
            mes: mesReporte,
            obrasIniciadas: existingMonth.obrasIniciadas,
            totalReportes: 0,
            reportesPendientes: 0,
            timestamp: parseISO(reporte.fecha_hora).getTime()
          };
          acc.push(monthData);
        }

        monthData.totalReportes += 1;
        if (reporte.estado === 'pendiente') {
          monthData.reportesPendientes += 1;
        }
      });

      return acc;
    }, [])
    .sort((a, b) => a.timestamp - b.timestamp);

  // Calcular estadísticas por obra
  const estadisticasObra: EstadisticaObra[] = stats.misObras.map((obra: Obra) => {
    const areasObra = stats.areasDeMisObras.filter((a: Area) => a.id_obra === obra.id_obra);
    const supervisoresObra = stats.supervisoresDeMisObras.filter((s: any) => 
      s.areas?.some((a: Area) => areasObra.some(ao => ao.id_area === a.id_area))
    );
    const camarasObra = stats.camaras.filter((c: Camara) => 
      areasObra.some(a => a.id_area === c.id_area)
    );
    
    const reportesObra = stats.reportesDeMisObras.filter((r: ReporteResumen) => 
      areasObra.some(area => area.id_area === r.id_area)
    );

    return {
      ...obra,
      totalAreas: areasObra.length,
      totalSupervisores: supervisoresObra.length,
      totalCamaras: camarasObra.length,
      totalReportes: reportesObra.length,
      reportesPendientes: reportesObra.filter(r => r.estado === 'pendiente').length
    };
  });

  // Filtrado de obras
  const filteredObras = useMemo(() => {
    return estadisticasObra.filter((obra: EstadisticaObra) => {
      const searchString = searchTerm.toLowerCase();
      const matchesSearch = 
        obra.nombre?.toLowerCase().includes(searchString) ||
        obra.descripcion?.toLowerCase().includes(searchString);

      const matchesStatus = statusFilter === 'all' || obra.estado === statusFilter;

      const createdDate = obra.created_at ? new Date(obra.created_at).toISOString().split('T')[0] : '';
      const startDate = obra.fecha_inicio ? new Date(obra.fecha_inicio).toISOString().split('T')[0] : '';
      
      const matchesDates = 
        (!dateFilters.createdAt || createdDate === dateFilters.createdAt) &&
        (!dateFilters.startDate || startDate === dateFilters.startDate);

      const matchesQuantity = () => {
        if (quantityFilter.type === 'none' || !quantityFilter.value) return true;
        const value = parseInt(quantityFilter.value);
        switch (quantityFilter.type) {
          case 'areas': return obra.totalAreas === value;
          case 'supervisores': return obra.totalSupervisores === value;
          case 'camaras': return obra.totalCamaras === value;
          case 'reportes': return obra.totalReportes === value;
          default: return true;
        }
      };

      return matchesSearch && matchesStatus && matchesDates && matchesQuantity();
    });
  }, [estadisticasObra, searchTerm, statusFilter, dateFilters, quantityFilter]);

  return (
    <section className="space-y-8">
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-indigo-400/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{totalObras}</p>
          <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Total Obras</p>
        </div>
          </div>
          <div className="mt-4 flex items-center text-indigo-600">
        <Activity className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">{obrasActivas} activas</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-emerald-400/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <LayoutGrid className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">{totalAreas}</p>
          <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Áreas</p>
        </div>
          </div>
          <div className="mt-4 flex items-center text-emerald-600">
        <LayoutGrid className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Total áreas</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-amber-400/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 group-hover:text-amber-600 transition-colors duration-300">{totalSupervisores}</p>
          <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Supervisores</p>
        </div>
          </div>
          <div className="mt-4 flex items-center text-amber-600">
        <Users className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Personal asignado</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-blue-400/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Camera className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{totalCamaras}</p>
          <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Cámaras</p>
        </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600">
        <Camera className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Instaladas</span>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-rose-400/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400/5 to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 group-hover:text-rose-600 transition-colors duration-300">{stats.totalReportes || 0}</p>
          <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Reportes</p>
        </div>
          </div>
          <div className="mt-4 flex items-center text-rose-600">
        <FileText className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Generados</span>
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Estado de obras */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Estado de Obras</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(obrasPorEstado).map(([name, value]) => ({
                  name,
                  value
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                label
              >
                {Object.entries(obrasPorEstado).map(([estado], index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.state[estado as keyof typeof COLORS.state]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tendencia mensual */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Tendencia Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataMensual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                yAxisId="left"
                name="Obras"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                name="Reportes"
                tick={{ fontSize: 12 }}
              />
              <RechartsTooltip 
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="stepAfter"
                dataKey="obrasIniciadas"
                stroke="#6366f1"
                strokeWidth={2}
                name="Obras Iniciadas"
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalReportes"
                stroke="#10b981"
                strokeWidth={2}
                name="Total Reportes"
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="reportesPendientes"
                stroke="#ef4444"
                strokeWidth={2}
                name="Reportes Pendientes"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
        <div className="px-6 py-5 border-b border-gray-200 bg-blue-500/50 hover:bg-blue-100 transition-all duration-300 ease-in-out cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
              <Activity 
                className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" 
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors duration-300">
                Detalle de Obras
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 mt-1">
                Listado completo de obras y sus métricas
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
                  placeholder="Nombre o descripción de la obra..."
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
                <option value="all">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Creación:</span>
                <input
                  type="date"
                  value={dateFilters.createdAt}
                  onChange={(e) => setDateFilters(prev => ({ ...prev, createdAt: e.target.value }))}
                  className="w-auto py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Inicio:</span>
                <input
                  type="date"
                  value={dateFilters.startDate}
                  onChange={(e) => setDateFilters(prev => ({ ...prev, startDate: e.target.value }))}
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
                  <option value="areas">Áreas</option>
                  <option value="supervisores">Supervisores</option>
                  <option value="camaras">Cámaras</option>
                  <option value="reportes">Reportes</option>
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
                <span className="font-semibold">{filteredObras.length}</span> obra{filteredObras.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto xl:overflow-visible m-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-10">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">Obra</th>
                <th className="px-6 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">Creación</th>
                <th className="px-6 py-5 text-left text-sm font-black text-gray-800 uppercase tracking-wider">Inicio</th>
                <th className="px-6 py-5 text-center text-sm font-black text-gray-800 uppercase tracking-wider">Áreas</th>
                <th className="px-6 py-5 text-center text-sm font-black text-gray-800 uppercase tracking-wider">Supervisores</th>
                <th className="px-6 py-5 text-center text-sm font-black text-gray-800 uppercase tracking-wider">Cámaras</th>
                <th className="px-6 py-5 text-center text-sm font-black text-gray-800 uppercase tracking-wider">Reportes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredObras.length > 0 ? (
                filteredObras.map((obra: any) => (
                  <tr key={obra.id_obra} className="group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/obra rounded-lg p-1.5 transition-all duration-300 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover/obra:bg-indigo-200 transition-all duration-300">
                          <Building2 className="h-3.5 w-3.5 text-indigo-600 group-hover/obra:text-indigo-700" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 group-hover/obra:text-indigo-700">{obra.nombre}</span>
                          <span className="text-xs text-gray-500 group-hover/obra:text-indigo-600">{obra.descripcion}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/estado">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
                          ${obra.estado === 'activo' ? 'border border-green-300 bg-green-50 text-green-800 group-hover/estado:bg-green-100' : 
                          obra.estado === 'inactivo' ? 'border border-amber-300 bg-amber-50 text-amber-800 group-hover/estado:bg-amber-100' : 
                          'border border-gray-300 bg-gray-50 text-gray-800 group-hover/estado:bg-gray-100'}`}>
                          <Activity className="h-3 w-3" />
                          {obra.estado}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/date rounded-lg p-1.5 transition-all duration-300">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover/date:bg-gray-200">
                          <Calendar className="h-3.5 w-3.5 text-gray-500 group-hover/date:text-gray-700" />
                        </div>
                        <span className="text-sm text-gray-500 group-hover/date:text-gray-700">
                          {obra.created_at ? format(parseISO(obra.created_at), 'dd/MM/yyyy') : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/inicio rounded-lg p-1.5 transition-all duration-300">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover/inicio:bg-gray-200">
                          <Calendar className="h-3.5 w-3.5 text-gray-500 group-hover/inicio:text-gray-700" />
                        </div>
                        <span className="text-sm text-gray-500 group-hover/inicio:text-gray-700">
                          {obra.fecha_inicio ? format(parseISO(obra.fecha_inicio), 'dd/MM/yyyy') : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 group/areas rounded-lg p-1.5 transition-all duration-300">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover/areas:bg-emerald-200">
                            <LayoutGrid className="h-3.5 w-3.5 text-emerald-600 group-hover/areas:text-emerald-700" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover/areas:text-emerald-700">{obra.totalAreas}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 group/users rounded-lg p-1.5 transition-all duration-300">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center group-hover/users:bg-amber-200">
                            <Users className="h-3.5 w-3.5 text-amber-600 group-hover/users:text-amber-700" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover/users:text-amber-700">{obra.totalSupervisores}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 group/cameras rounded-lg p-1.5 transition-all duration-300">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover/cameras:bg-blue-200">
                            <Camera className="h-3.5 w-3.5 text-blue-600 group-hover/cameras:text-blue-700" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover/cameras:text-blue-700">{obra.totalCamaras}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 group/reports rounded-lg p-1.5 transition-all duration-300">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center group-hover/reports:bg-rose-200">
                            <FileText className="h-3.5 w-3.5 text-rose-600 group-hover/reports:text-rose-700" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover/reports:text-rose-700">{obra.totalReportes}</span>
                        </div>
                        {obra.reportesPendientes > 0 && (
                          <span className="text-xs text-rose-500 group-hover/reports:text-rose-600">{obra.reportesPendientes} pendientes</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <EmptyState 
                      title="No hay obras disponibles"
                      message="No se encontraron obras que coincidan con los filtros seleccionados."
                      icon={<Building2 className="w-16 h-16" />}
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

export default EstadisticasObras;