interface Props {
  filters: { estado?: string; fecha_desde?: string; fecha_hasta?: string };
  setFilters: (f: any) => void;
}

const ReporteFilters: React.FC<Props> = ({ filters, setFilters }) => (
  <div className="flex gap-4 mb-4">
    <select
      value={filters.estado}
      onChange={e => setFilters((f: any) => ({ ...f, estado: e.target.value }))}
      className="border rounded px-2 py-1"
    >
      <option value="">Todos los estados</option>
      <option value="pendiente">Pendiente</option>
      <option value="en_revision">En revisión</option>
      <option value="cerrado">Cerrado</option>
    </select>
    <input
      type="date"
      value={filters.fecha_desde}
      onChange={e => setFilters((f: any) => ({ ...f, fecha_desde: e.target.value }))}
      className="border rounded px-2 py-1"
    />
    <input
      type="date"
      value={filters.fecha_hasta}
      onChange={e => setFilters((f: any) => ({ ...f, fecha_hasta: e.target.value }))}
      className="border rounded px-2 py-1"
    />
  </div>
);

export default ReporteFilters;