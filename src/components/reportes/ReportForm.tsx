import React, { useEffect, useState } from 'react';
import { useReportsContext } from '../../context/ReportsContext';
import { useUserContext } from '../../context/UserContext';
import { X, Loader2, Wand2, CheckCircle, AlertCircle } from 'lucide-react';
import type { CategoriaEpp } from '../../types/entities';

interface ReportFormProps {
  areaId: number;
  camaras: { id_camara: number; nombre: string }[];
  onSuccess: () => void;
  onCancel: () => void;
  initialValues?: {
    descripcion?: string;
    id_camara?: number | '';
    selectedEpp?: number[];
    imagen_url?: string;
    estado?: 'pendiente' | 'en revision' | 'cerrado'; // <-- AGREGA ESTA LÍNEA
  };
  isEdit?: boolean;
  reporteId?: number;
}

const ReportForm: React.FC<ReportFormProps> = ({
  areaId,
  camaras,
  onSuccess,
  onCancel,
  initialValues,
  isEdit,
  reporteId,
}) => {
  const { user } = useUserContext();
  const {
    create,
    detectInfracciones,
    categoriasEpp,
    loadCategoriasEpp,
    isLoading,
    error,
    clearError,
    update,
  } = useReportsContext();

  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [selectedEpp, setSelectedEpp] = useState<number[]>([]);
  const [idCamara, setIdCamara] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [estado, setEstado] = useState<'pendiente' | 'en revision' | 'cerrado'>('pendiente');

  // Diccionario de mapeo IA → nombre de EPP en tu catálogo
  const IA_TO_EPP_MAP: Record<string, string> = {
    'NO-Hardhat': 'Casco',
    'NO-Mask': 'Guantes', // O "Mascarilla" si así está en tu catálogo
    'NO-Safety Vest': 'Chaleco',
    // Agrega más si tu IA detecta otras clases
  };

  // Cargar categorías EPP al montar
  useEffect(() => {
    loadCategoriasEpp();
    clearError();
  }, [loadCategoriasEpp, clearError]);

  // Cargar valores iniciales si existen
  useEffect(() => {
    if (initialValues) {
      setDescripcion(initialValues.descripcion || '');
      setIdCamara(initialValues.id_camara ?? '');
      setSelectedEpp(initialValues.selectedEpp || []);
      // Si tienes initialValues.estado, úsalo:
      if (initialValues.estado) setEstado(initialValues.estado);
    }
  }, [initialValues]);

  // Manejar selección de EPP
  const handleEppChange = (id: number) => {
    setSelectedEpp((prev) =>
      prev.includes(id)
        ? prev.filter((id) => id !== id)
        : [...prev, id]
    );
  };

  // Manejar imagen
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  // Analizar con IA
  const handleAnalizarIA = async () => {
    if (!imagen && !initialValues?.imagen_url) return;
    setAnalyzing(true);
    try {
      const fileToAnalyze = imagen;
      if (!fileToAnalyze) {
        setShowToast({ type: 'error', message: 'Debes seleccionar una imagen para analizar.' });
        setAnalyzing(false);
        return;
      }
      // detectInfracciones retorna { clase: string }[]
      const infracciones = await detectInfracciones(fileToAnalyze);

      // Extrae las clases detectadas por la IA
      const clasesDetectadas = infracciones.map((inf) => inf.clase);

      // Mapea las clases IA a los nombres de tu catálogo
      const nombresEpp = clasesDetectadas
        .map((clase: string) => IA_TO_EPP_MAP[clase])
        .filter(Boolean);

      // Busca los id_epp en tu catálogo según los nombres mapeados
      const idsDetectados = categoriasEpp
        .filter(epp => nombresEpp.includes(epp.nombre))
        .map(epp => Number(epp.id));

      setSelectedEpp(idsDetectados);

      if (idsDetectados.length > 0) {
        setShowToast({ type: 'success', message: 'Infracciones detectadas y seleccionadas automáticamente.' });
      } else {
        setShowToast({ type: 'error', message: 'No se detectaron infracciones de EPP en la imagen.' });
      }
    } catch {
      setShowToast({ type: 'error', message: 'Error al analizar la imagen.' });
    } finally {
      setAnalyzing(false);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de areaId
    if (typeof areaId !== 'number' || isNaN(areaId)) {
      setShowToast({ type: 'error', message: 'Error interno: área no válida.' });
      setSubmitting(false);
      return;
    }

    if ((!imagen && !initialValues?.imagen_url) || selectedEpp.length === 0) {
      setShowToast({ type: 'error', message: 'Debes subir una imagen y seleccionar al menos un EPP incumplido.' });
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append('id_area', areaId.toString());
    formData.append('id_usuario', user?.id_usuario?.toString() || '');
    if (idCamara) formData.append('id_camara', idCamara.toString());
    formData.append('descripcion', descripcion);
    if (imagen) {
      formData.append('imagen', imagen);
    } else if (isEdit && initialValues?.imagen_url) {
      // Envía la URL de la imagen anterior si no se subió una nueva
      formData.append('imagen_url', initialValues.imagen_url);
    }
    formData.append(
      'infracciones',
      JSON.stringify(
        selectedEpp.map((id) => {
          const cat = categoriasEpp.find((c) => c.id === id);
          return { id, nombre: cat?.nombre || '' };
        })
      )
    );
    formData.append('estado', estado);
    let ok = false;
    if (isEdit && reporteId) {
      ok = await update(reporteId, formData);
    } else {
      ok = await create(formData);
    }
    setSubmitting(false);
    if (ok) {
      setShowToast({ type: 'success', message: isEdit ? 'Reporte actualizado correctamente.' : 'Reporte creado correctamente.' });
      setTimeout(() => {
        setShowToast(null);
        onSuccess();
      }, 1200);
    } else {
      setShowToast({ type: 'error', message: 'Ocurrió un error al guardar el reporte.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onCancel}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Editar Reporte' : 'Nuevo Reporte de Infracción'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe la infracción (opcional)"
            />
          </div>
          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen de evidencia <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="block w-full"
              required={!isEdit}
            />
            {imagen ? (
              <img
                src={URL.createObjectURL(imagen)}
                alt="Preview"
                className="mt-2 rounded-lg border w-32 h-32 object-cover"
              />
            ) : initialValues?.imagen_url ? (
              <img
                src={initialValues.imagen_url}
                alt="Preview"
                className="mt-2 rounded-lg border w-32 h-32 object-cover"
              />
            ) : null}
          </div>
          {/* Cámara */}
          {camaras.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cámara (opcional)
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={idCamara}
                onChange={(e) => setIdCamara(Number(e.target.value))}
              >
                <option value="">Sin cámara</option>
                {camaras.map((c) => (
                  <option key={c.id_camara} value={c.id_camara}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* EPP incumplidos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              EPP incumplidos <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {categoriasEpp
                .filter(epp => typeof epp.id === 'number' && !isNaN(Number(epp.id)))
                .map((epp) => {
                  const id = Number(epp.id);
                  const checked = selectedEpp.includes(id);
                  return (
                    <label
                      key={id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
                        checked
                          ? 'bg-orange-100 border-orange-400'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedEpp((prev) =>
                            prev.includes(id)
                              ? prev.filter((eid) => eid !== id)
                              : [...prev, id]
                          );
                        }}
                      />
                      <span>{epp.nombre}</span>
                      <span className="text-xs text-gray-400">
                        ({epp.nivel_riesgo})
                      </span>
                    </label>
                  );
                })}
            </div>
            <button
              type="button"
              className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition disabled:opacity-50"
              onClick={handleAnalizarIA}
              disabled={(!imagen && !initialValues?.imagen_url) || analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Analizando...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Analizar con IA
                </>
              )}
            </button>
          </div>
          {/* Estado del reporte (solo para edicion y rol de coordinador) */}
          {isEdit && user?.global_role === 'coordinador' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado del reporte
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={estado}
                onChange={e => setEstado(e.target.value as 'pendiente' | 'en revision' | 'cerrado')}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en revision">En revisión</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          )}
          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Guardando...
                </>
              ) : (
                isEdit ? 'Guardar cambios' : 'Enviar'
              )}
            </button>
          </div>
          {error && (
            <div className="text-red-600 text-sm mt-2">{error}</div>
          )}
        </form>
        {/* Toast/Modal de notificación */}
        {showToast && (
          <div className={`fixed left-1/2 -translate-x-1/2 bottom-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2
            ${showToast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {showToast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{showToast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;