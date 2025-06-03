import React from 'react'; // Removemos useState ya que no lo necesitamos más
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart3, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Area } from '../../types/entities';

const COLORS = {
  primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  danger: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
};

const EstadisticasReportes = ({ stats }: { stats: any }) => {
  // Removemos los estados que ya no necesitamos
  // const [periodoSeleccionado, setPeriodoSeleccionado] = useState('7dias');
  // const [tipoGrafico, setTipoGrafico] = useState('barras');

  // Cálculos de estadísticas
  const totalReportes = stats.totalReportes || 0;
  const reportesPendientes = stats.reportesPorEstado?.pendiente || 0;
  const reportesCerrados = stats.reportesPorEstado?.cerrado || 0;
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

  return (
    <section className="space-y-8">
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-blue-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Total Reportes</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalReportes}</p>
          <span className="text-sm text-gray-500">en total</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-amber-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Pendientes</h3>
          </div>
          <p className="text-3xl font-bold text-amber-600">{reportesPendientes}</p>
          <span className="text-sm text-gray-500">por resolver</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="text-emerald-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Resueltos</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{reportesCerrados}</p>
          <span className="text-sm text-gray-500">completados</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="text-indigo-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Tasa Resolución</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{tasaResolucion}%</p>
          <span className="text-sm text-gray-500">promedio</span>
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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-700">Últimos Reportes</h3>
        </div>
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
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.reportesDeMisObras?.slice(0, 5).map((reporte: any) => (
                <tr key={reporte.id_reporte} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(reporte.fecha_hora), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reporte.nombre_obra}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reporte.nombre_area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${reporte.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                        reporte.estado === 'en revisión' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {reporte.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reporte.usuario?.nombres} {reporte.usuario?.apellidos}
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