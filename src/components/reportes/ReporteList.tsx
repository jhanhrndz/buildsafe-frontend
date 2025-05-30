import ReporteCard from './ReporteCard';
import type { ReporteResumen } from '../../types/entities';

interface Props {
  reportes: ReporteResumen[];
  isLoading?: boolean;
  error?: string | null;
  filters?: { estado?: string; fecha_desde?: string; fecha_hasta?: string };
}

const ReporteList: React.FC<Props> = ({ reportes, isLoading, error, filters }) => {
  // Filtrado en memoria (ya que el contexto trae todos los reportes relevantes)
  const filtered = reportes.filter(r => {
    if (filters?.estado && r.estado !== filters.estado) return false;
    if (filters?.fecha_desde && r.fecha_hora < filters.fecha_desde) return false;
    if (filters?.fecha_hasta && r.fecha_hora > filters.fecha_hasta) return false;
    return true;
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!filtered.length) return <div>No hay reportes para mostrar.</div>;

  return (
    <div className="grid gap-4">
      {filtered.map(r => (
        <ReporteCard key={r.id_reporte} reporte={r} />
      ))}
    </div>
  );
};

export default ReporteList;