import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Users, Camera, FileText, LayoutGrid } from 'lucide-react';

const COLORS = {
  primary: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
  state: {
    activo: '#10b981',
    inactivo: '#f59e0b',
    finalizado: '#6b7280'
  }
};

const EstadisticasObras = ({ stats }: { stats: any }) => {
  const [obraSeleccionada, setObraSeleccionada] = useState<string | null>(null);

  // Estadísticas generales
  const totalObras = stats.misObras.length;
  const obrasActivas = stats.misObras.filter(o => o.estado === 'activo').length;
  const totalAreas = stats.areasDeMisObras.length;
  const totalSupervisores = new Set(stats.supervisoresDeMisObras.map(s => s.id_usuario)).size;
  const totalCamaras = stats.camaras.length;

  // Obras por estado
  const obrasPorEstado = stats.misObras.reduce((acc: Record<string, number>, obra: any) => {
    acc[obra.estado] = (acc[obra.estado] || 0) + 1;
    return acc;
  }, {});

  // Obras y reportes por mes
  const dataMensual = stats.misObras.reduce((acc: any[], obra: any) => {
    if (obra.fecha_inicio) {
      const mes = format(parseISO(obra.fecha_inicio), 'MMM yyyy', { locale: es });
      const reportes = stats.reportesDeMisObras.filter(r => r.id_obra === obra.id_obra).length;
      
      const existingMonth = acc.find(m => m.mes === mes);
      if (existingMonth) {
        existingMonth.obras += 1;
        existingMonth.reportes += reportes;
      } else {
        acc.push({ mes, obras: 1, reportes });
      }
    }
    return acc;
  }, []);

  // Calcular estadísticas por obra
  const estadisticasObra = stats.misObras.map((obra: any) => {
    const areasObra = stats.areasDeMisObras.filter(a => a.id_obra === obra.id_obra);
    const supervisoresObra = stats.supervisoresDeMisObras.filter(s => 
      s.areas.some(a => areasObra.some(ao => ao.id_area === a.id_area))
    );
    const camarasObra = stats.camaras.filter(c => 
      areasObra.some(a => a.id_area === c.id_area)
    );
    const reportesObra = stats.reportesDeMisObras.filter(r => r.id_obra === obra.id_obra);

    return {
      ...obra,
      totalAreas: areasObra.length,
      totalSupervisores: supervisoresObra.length,
      totalCamaras: camarasObra.length,
      totalReportes: reportesObra.length,
      reportesPendientes: reportesObra.filter(r => r.estado === 'pendiente').length,
    };
  });

  return (
    <section className="space-y-8">
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="text-indigo-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Total Obras</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{totalObras}</p>
          <span className="text-sm text-gray-500">{obrasActivas} activas</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="text-emerald-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Áreas</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{totalAreas}</p>
          <span className="text-sm text-gray-500">en total</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-amber-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Supervisores</h3>
          </div>
          <p className="text-3xl font-bold text-amber-600">{totalSupervisores}</p>
          <span className="text-sm text-gray-500">asignados</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Camera className="text-blue-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Cámaras</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalCamaras}</p>
          <span className="text-sm text-gray-500">instaladas</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-rose-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Reportes</h3>
          </div>
          <p className="text-3xl font-bold text-rose-600">{stats.totalReportes}</p>
          <span className="text-sm text-gray-500">generados</span>
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
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="obras"
                stroke="#6366f1"
                strokeWidth={2}
                name="Obras"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="reportes"
                stroke="#ef4444"
                strokeWidth={2}
                name="Reportes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-700">Detalle de Obras</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inicio
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Áreas
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisores
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cámaras
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reportes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {estadisticasObra.map((obra: any) => (
                <tr 
                  key={obra.id_obra}
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{obra.nombre}</div>
                    <div className="text-sm text-gray-500">{obra.descripcion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${obra.estado === 'activo' ? 'bg-green-100 text-green-800' : 
                        obra.estado === 'inactivo' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {obra.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {obra.fecha_inicio ? format(parseISO(obra.fecha_inicio), 'dd/MM/yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{obra.totalAreas}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{obra.totalSupervisores}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{obra.totalCamaras}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="font-medium text-gray-900">{obra.totalReportes}</div>
                    <div className="text-xs text-red-500">{obra.reportesPendientes} pendientes</div>
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

export default EstadisticasObras;