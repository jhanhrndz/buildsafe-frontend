import { useEffect, useState } from 'react';
import { useReportesContext } from '../../context/ReportesContext';
import { ReporteService } from '../../services/reporte';
import type { ReporteDetail} from '../../types/entities';
import type { CreateReportePayload } from '../../services/reporte';
import ConfirmDialog from '../shared/ConfirmDialog';

interface Props {
  id: number;
  onClose: () => void;
}

const ReporteEditModal: React.FC<Props> = ({ id, onClose }) => {
  const { getById, refresh } = useReportesContext();
  const [detalle, setDetalle] = useState<ReporteDetail | null>(null);
  const [form, setForm] = useState<Partial<CreateReportePayload>>({});
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar datos al abrir
  useEffect(() => {
    getById(id).then(det => {
      setDetalle(det ?? null);
      if (det) {
        setForm({
          descripcion: det.descripcion,
          estado: det.estado,
          id_area: det.id_area,
          id_camara: det.id_camara ?? undefined, // <-- convierte null a undefined
        });
      }
    });
  }, [id, getById]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatePayload = { ...form };
      if (file) updatePayload.imagen = file;

      await ReporteService.update(id, updatePayload);
      await refresh();
      onClose();
    } catch (err) {
      alert('Error al actualizar reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await ReporteService.delete(id);
      await refresh();
      setIsDeleting(false);
      setShowDelete(false);
      onClose();
    } catch (err) {
      setIsDeleting(false);
      alert('Error al eliminar reporte');
    }
  };

  if (!detalle) return <div className="p-8">Cargando...</div>;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative"
        onSubmit={handleSubmit}
      >
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Editar Reporte</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion || ''}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            name="estado"
            value={form.estado || ''}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_revision">En revisión</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Imagen de evidencia</label>
          {detalle.imagen_url && (
            <img src={detalle.imagen_url} alt="Evidencia" className="mb-2 rounded shadow max-h-32" />
          )}
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            className="text-red-600 hover:underline"
            onClick={() => setShowDelete(true)}
            disabled={isSubmitting}
          >
            Eliminar reporte
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
      {showDelete && (
        <ConfirmDialog
          title="Eliminar reporte"
          message="¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </div>
  );
};

export default ReporteEditModal;