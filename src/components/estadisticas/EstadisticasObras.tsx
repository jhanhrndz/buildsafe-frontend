import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Users, Camera, FileText, LayoutGrid, Activity, FileBarChart } from 'lucide-react';
import type { Obra, Area, User as Supervisor, Camara, ReporteResumen } from '../../types/entities';
import { ActionCodeURL } from 'firebase/auth/web-extension';

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
}

const EstadisticasObras = ({ stats }: EstadisticasObrasProps) => {
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
      const mesInicio = format(parseISO(obra.fecha_inicio), 'MMM yyyy', { locale: es });
      
      let existingMonth = acc.find(m => m.mes === mesInicio);
      if (!existingMonth) {
        existingMonth = {
          mes: mesInicio,
          obrasIniciadas: 0,
          totalReportes: 0,
          reportesPendientes: 0,
          timestamp: parseISO(obra.fecha_inicio).getTime()
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
    const supervisoresObra = stats.supervisoresDeMisObras.filter((s: Supervisor) => 
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
        <div className="px-6 py-5 border-b border-gray-200 bg-blue-50 hover:bg-blue-100 transition-all duration-300 ease-in-out cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
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
                  Creación
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
                <tr key={obra.id_obra} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
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
                    {obra.created_at ? format(parseISO(obra.created_at), 'dd/MM/yyyy') : '-'}
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