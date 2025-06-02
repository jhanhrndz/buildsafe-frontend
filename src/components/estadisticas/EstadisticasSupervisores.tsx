import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const EstadisticasSupervisores = ({ stats }: { stats: any }) => {
  // Supervisores con más reportes
  const dataSupervisores = stats.reportesPorSupervisor.map((s: any) => ({
    name: `${s.supervisor.nombres} ${s.supervisor.apellidos}`,
    reportes: s.total,
  }));

  // Tabla de supervisores
  const resumenSupervisores = stats.supervisoresDeMisObras.map((s: any) => ({
    nombre: `${s.nombres} ${s.apellidos}`,
    correo: s.correo,
    areas: s.areas.length,
    reportes: stats.reportesDeMisObras.filter((r: any) => r.id_usuario === s.id_usuario).length,
  }));

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Supervisores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Total y ranking */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold mb-2">Total de Supervisores</h3>
          <p className="text-4xl font-bold text-amber-600 mb-4">{stats.supervisoresDeMisObras.length}</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataSupervisores.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <RechartsTooltip />
              <Bar dataKey="reportes" fill="#fbbf24" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Tabla de supervisores */}
      <div className="mt-8">
        <h3 className="font-bold mb-2">Resumen de Supervisores</h3>
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Áreas</th>
              <th className="p-2">Reportes</th>
            </tr>
          </thead>
          <tbody>
            {resumenSupervisores.map((s: any, idx: number) => (
              <tr key={idx}>
                <td className="p-2">{s.nombre}</td>
                <td className="p-2">{s.correo}</td>
                <td className="p-2">{s.areas}</td>
                <td className="p-2">{s.reportes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default EstadisticasSupervisores;