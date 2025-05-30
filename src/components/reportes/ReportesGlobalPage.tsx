import ReporteList from './ReporteList';
import ReporteFilters from './ReporteFilters';
import { useReportesContext } from '../../context/ReportesContext';
import { useState } from 'react';

const ReportesGlobalPage = () => {
  const { reportes, isLoading, error, refresh } = useReportesContext();
  const [filters, setFilters] = useState({ estado: '', fecha_desde: '', fecha_hasta: '' });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>
      <ReporteFilters filters={filters} setFilters={setFilters} />
      <button onClick={refresh} className="mb-4">Refrescar</button>
      {/* NO debe haber botón de creación aquí */}
      <ReporteList reportes={reportes} isLoading={isLoading} error={error} filters={filters} />
    </div>
  );
};

export default ReportesGlobalPage;