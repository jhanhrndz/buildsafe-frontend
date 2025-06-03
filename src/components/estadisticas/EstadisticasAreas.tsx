import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LayoutGrid, Camera, Users, AlertTriangle } from 'lucide-react';
import type { Obra, Area, User as Supervisor, Camara, ReporteResumen } from '../../types/entities';

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
    const supervisor = stats.supervisoresDeMisObras.find((s: Supervisor) => 
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

  return (
    <section className="space-y-8">
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="text-indigo-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Total Áreas</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{totalAreas}</p>
          <span className="text-sm text-gray-500">distribuidas en {stats.misObras.length} obras</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-emerald-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Con Supervisor</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{areasConSupervisor}</p>
          <span className="text-sm text-gray-500">{totalAreas - areasConSupervisor} sin asignar</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Camera className="text-amber-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Con Cámaras</h3>
          </div>
          <p className="text-3xl font-bold text-amber-600">{areasConCamaras}</p>
          <span className="text-sm text-gray-500">{totalAreas - areasConCamaras} sin cámaras</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-rose-600" size={24} />
            <h3 className="text-sm font-medium text-gray-500">Con Reportes</h3>
          </div>
          <p className="text-3xl font-bold text-rose-600">{areasConReportes}</p>
          <span className="text-sm text-gray-500">{totalAreas - areasConReportes} sin reportes</span>
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
        <div className="px-6 py-5 border-b border-gray-200 bg-blue-50 hover:bg-blue-100 transition-all duration-300 ease-in-out cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
              <LayoutGrid 
                className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" 
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors duration-300">
                Detalle de Areas
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 mt-1">
                Listado completo de áreas y sus métricas
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cámaras
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reportes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Reporte
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {estadisticasArea
                .filter((area: any) => 
                  obraFiltrada === 'todas' || area.id_obra === obraFiltrada
                )
                .map((area: any) => (
                  <tr key={area.id_area} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{area.nombre}</div>
                      <div className="text-sm text-gray-500">{area.descripcion}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {area.nombreObra}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {area.supervisor}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="font-medium text-gray-900">{area.totalCamaras}</div>
                      <div className="text-xs text-green-500">{area.camarasActivas} activas</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="font-medium text-gray-900">{area.totalReportes}</div>
                      <div className="text-xs text-red-500">{area.reportesPendientes} pendientes</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {area.ultimoReporte 
                        ? format(new Date(area.ultimoReporte), 'dd/MM/yyyy HH:mm', { locale: es })
                        : 'Sin reportes'}
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

export default EstadisticasAreas;