import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users, AlertTriangle, CheckCircle2, LayoutGrid } from 'lucide-react';

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
                {stats.supervisoresStats?.reduce((acc: number, s: any) => acc + s.totalReportes, 0)}
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
                {stats.supervisoresStats?.reduce((acc: number, s: any) => acc + s.reportesPendientes, 0)}
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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                Listado completo de los supervisores y sus estadísticas
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
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
              {stats.supervisoresStats?.map((supervisor: any) => (
                <tr key={supervisor.id_usuario} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {supervisor.nombres} {supervisor.apellidos}
                    </div>
                    <div className="text-sm text-gray-500">{supervisor.correo}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="font-medium text-gray-900">{supervisor.totalAreas}</div>
                    <div className="text-xs text-gray-500">asignadas</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="font-medium text-gray-900">{supervisor.totalReportes}</div>
                    <div className="text-xs text-red-500">{supervisor.reportesPendientes} pendientes</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {supervisor.ultimoReporte 
                      ? format(new Date(supervisor.ultimoReporte), 'dd/MM/yyyy HH:mm', { locale: es })
                      : 'Sin reportes'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${supervisor.totalAreas > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {supervisor.totalAreas > 0 ? 'Activo' : 'Sin áreas'}
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

export default EstadisticasSupervisores;