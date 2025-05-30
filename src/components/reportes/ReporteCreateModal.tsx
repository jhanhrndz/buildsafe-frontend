import { useState } from 'react';
import { useReportesContext } from '../../context/ReportesContext';
import { ReporteService } from '../../services/reporte';
import type { CreateReportePayload } from '../../services/reporte';

interface Props {
  onClose: () => void;
  defaultAreaId?: number;
  defaultCamaraId?: number;
}

const ReporteCreateModal: React.FC<Props> = ({
  onClose,
  defaultAreaId,
  defaultCamaraId,
}) => {
  const { refresh } = useReportesContext();
  const [form, setForm] = useState<Partial<CreateReportePayload>>({
    id_area: defaultAreaId,
    id_camara: defaultCamaraId,
    descripcion: '',
    estado: 'pendiente',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'infracciones'>('form');
  const [detectedInfracciones, setDetectedInfracciones] = useState<{ id_epp?: number; nombre: string }[]>([]);
  const [selectedInfracciones, setSelectedInfracciones] = useState<{ id_epp?: number; nombre: string }[]>([]);
  const [manualInfraccion, setManualInfraccion] = useState('');

  // Paso 1: Subir imagen y obtener infracciones
  const handleDetectInfracciones = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.descripcion || !form.id_area || !file) {
      alert('Completa la descripción, área y selecciona una imagen.');
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('imagen', file);
      // Cambia la URL si es necesario según tu entorno/proxy
      const res = await fetch('/api/reportes/detect-infracciones', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setDetectedInfracciones(data.infracciones || []);
      setSelectedInfracciones(data.infracciones || []);
      setStep('infracciones');
    } catch (err) {
      alert('Error detectando infracciones');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Paso 2: Confirmar y enviar reporte
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = {
        ...form,
        imagen: file,
        infracciones: selectedInfracciones,
      };
      await ReporteService.create(payload);
      await refresh();
      setForm({
        id_area: defaultAreaId,
        id_camara: defaultCamaraId,
        descripcion: '',
        estado: 'pendiente',
      });
      setFile(null);
      onClose();
    } catch (err) {
      alert('Error al crear reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI
  if (step === 'form') {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <form
          className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative"
          onSubmit={handleDetectInfracciones}
        >
          <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-4">Nuevo Reporte</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion || ''}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Imagen de evidencia</label>
            <input type="file" accept="image/*" onChange={e => {
              if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
            }} required />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Analizando...' : 'Detectar infracciones'}
          </button>
        </form>
      </div>
    );
  }

  // Paso 2: Mostrar infracciones detectadas y permitir agregar más
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
        <h2 className="text-xl font-bold mb-4">Confirma las infracciones</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Infracciones detectadas</label>
          <div className="flex flex-col gap-2">
            {detectedInfracciones.length === 0 && (
              <span className="text-gray-500 text-sm">No se detectaron infracciones automáticamente.</span>
            )}
            {detectedInfracciones.map((inf, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedInfracciones.some(sel => sel.nombre === inf.nombre)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedInfracciones([...selectedInfracciones, inf]);
                    } else {
                      setSelectedInfracciones(selectedInfracciones.filter(sel => sel.nombre !== inf.nombre));
                    }
                  }}
                />
                {inf.nombre}
              </label>
            ))}
          </div>
        </div>
        {/* Permitir agregar infracciones manualmente */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Agregar infracción manual</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nombre de la infracción"
              className="border rounded p-2 w-full"
              value={manualInfraccion}
              onChange={e => setManualInfraccion(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && manualInfraccion.trim()) {
                  if (!selectedInfracciones.some(sel => sel.nombre === manualInfraccion.trim())) {
                    setSelectedInfracciones([...selectedInfracciones, { nombre: manualInfraccion.trim() }]);
                  }
                  setManualInfraccion('');
                  e.preventDefault();
                }
              }}
            />
            <button
              type="button"
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => {
                if (manualInfraccion.trim() && !selectedInfracciones.some(sel => sel.nombre === manualInfraccion.trim())) {
                  setSelectedInfracciones([...selectedInfracciones, { nombre: manualInfraccion.trim() }]);
                  setManualInfraccion('');
                }
              }}
            >
              Agregar
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Infracciones seleccionadas</label>
          <ul className="list-disc ml-6">
            {selectedInfracciones.map((inf, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {inf.nombre}
                <button
                  type="button"
                  className="text-red-500 ml-2"
                  onClick={() => setSelectedInfracciones(selectedInfracciones.filter((_, i) => i !== idx))}
                  title="Quitar"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isSubmitting || selectedInfracciones.length === 0}
        >
          {isSubmitting ? 'Creando...' : 'Crear reporte'}
        </button>
      </form>
    </div>
  );
};

export default ReporteCreateModal;