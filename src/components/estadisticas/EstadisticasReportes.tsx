import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = {
  primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  danger: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
};

const EstadisticasReportes = ({ stats }: { stats: any }) => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('7dias');
  const [tipoGrafico, setTipoGrafico] = useState('barras');

  // Procesar datos para gráficos temporales
  const fechaActual = new Date();
  const reportesPorFecha = stats.reportesDeMisObras.reduce((acc: any, reporte: any) => {
    const fecha = format(new Date(reporte.fecha_hora), 'dd/MM/yyyy', { locale: es });
    acc[fecha] = (acc[fecha] || 0) + 1;
    return acc;
  }, {});

  // Datos para gráfico de tendencia
  const reportesTendencia = Object.entries(reportesPorFecha)
    .map(([fecha, total]) => ({ fecha, total }))
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  // Calcular estadísticas adicionales
  const promedioReportesDiarios = (stats.totalReportes / Object.keys(reportesPorFecha).length).toFixed(1);
  const tasaResolucion = ((stats.reportesPorEstado.cerrado / stats.totalReportes) * 100).toFixed(1);

  return (
    <section className="bg-gray-50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Análisis de Reportes</h2>
        <div className="flex gap-4">
          {/* Filtros y controles */}
          <select 
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
          >
            <option value="7dias">Últimos 7 días</option>
            <option value="30dias">Últimos 30 días</option>
            <option value="90dias">Últimos 90 días</option>
          </select>
          <select
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
            value={tipoGrafico}
            onChange={(e) => setTipoGrafico(e.target.value)}
          >
            <option value="barras">Gráfico de Barras</option>
            <option value="linea">Gráfico de Línea</option>
            <option value="pie">Gráfico Circular</option>
          </select>
        </div>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Reportes</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalReportes}</p>
          <span className="text-sm text-gray-500">en total</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Promedio Diario</h3>
          <p className="text-3xl font-bold text-green-600">{promedioReportesDiarios}</p>
          <span className="text-sm text-gray-500">reportes/día</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Tasa de Resolución</h3>
          <p className="text-3xl font-bold text-amber-600">{tasaResolucion}%</p>
          <span className="text-sm text-gray-500">reportes cerrados</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Pendientes</h3>
          <p className="text-3xl font-bold text-red-600">{stats.reportesPorEstado.pendiente}</p>
          <span className="text-sm text-gray-500">por resolver</span>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Estado de reportes */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Estado de Reportes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(stats.reportesPorEstado).map(([name, value]) => ({
                  name,
                  value,
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
                {Object.entries(stats.reportesPorEstado).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tendencia temporal */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Tendencia de Reportes</h3>
          <ResponsiveContainer width="100%" height={300}>
            {tipoGrafico === 'linea' ? (
              <LineChart data={reportesTendencia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            ) : (
              <BarChart data={reportesTendencia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="total" fill="#3b82f6">
                  {reportesTendencia.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla mejorada */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <h3 className="font-bold text-gray-700 p-6 border-b">Últimos Reportes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.reportesDeMisObras.slice(0, 5).map((r: any) => (
                <tr key={r.id_reporte} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(r.fecha_hora), 'dd MMM yyyy HH:mm', { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {r.nombre_obra}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {r.nombre_area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {`${r.usuario?.nombres} ${r.usuario?.apellidos}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${r.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                        r.estado === 'en revisión' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EstadisticasReportes;