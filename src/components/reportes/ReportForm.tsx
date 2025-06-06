import React, { useEffect, useState } from 'react';
import { X, Loader2, Wand2, CheckCircle, AlertCircle, Upload, Camera, Eye, EyeOff } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import { useReportsContext } from '../../context/ReportsContext';
// Mock interfaces for the component
interface User {
  id_usuario?: number;
  global_role?: string;
}

interface CategoriaEpp {
  id: number;
  nombre: string;
  nivel_riesgo: 'alto' | 'medio' | 'bajo';
}

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
    estado?: 'pendiente' | 'en revision' | 'cerrado';
  };
  isEdit?: boolean;
  reporteId?: number;
  imagenFile?: File | null; // <-- agrega esto
}


const ReportForm: React.FC<ReportFormProps> = ({
  areaId,
  camaras,
  onSuccess,
  onCancel,
  initialValues,
  isEdit,
  reporteId,
  imagenFile,
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const IA_TO_EPP_MAP: Record<string, string> = {
    'NO-Hardhat': 'Casco',
    'NO-Mask': 'Mascara',
    'NO-Safety Vest': 'Chaleco',
  };

  useEffect(() => {
    loadCategoriasEpp();
    clearError();
  }, [loadCategoriasEpp, clearError]);

const [isInitialized, setIsInitialized] = useState(false);

useEffect(() => {
  if (initialValues && !isInitialized) {
    setDescripcion(initialValues.descripcion || '');
    setIdCamara(initialValues.id_camara ?? '');
    setSelectedEpp(initialValues.selectedEpp || []);
    if (initialValues.estado) setEstado(initialValues.estado);
    if (initialValues.imagen_url) setImagePreview(initialValues.imagen_url);
    setIsInitialized(true);
  }
}, [initialValues, isInitialized]);

  useEffect(() => {
    if (imagenFile) {
      setImagen(imagenFile);
      setImagePreview(URL.createObjectURL(imagenFile));
    } else if (initialValues?.imagen_url) {
      // Si hay una imagen URL pero no un archivo, establece la preview
      setImagePreview(initialValues.imagen_url);
    }
  }, [imagenFile, initialValues]);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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

      const infracciones = await detectInfracciones(fileToAnalyze);
      const clasesDetectadas = infracciones.map((inf) => inf.clase);
      const nombresEpp = clasesDetectadas
        .map((clase: string) => IA_TO_EPP_MAP[clase])
        .filter(Boolean);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof areaId !== 'number' || isNaN(areaId)) {
      setShowToast({ type: 'error', message: 'Error interno: área no válida.' });
      return;
    }

    if (!imagen && !initialValues?.imagen_url && !imagePreview) {
      setShowToast({
        type: 'error',
        message: 'Debes subir una imagen de evidencia.'
      });
      return;
    }

    if (selectedEpp.length === 0) {
      setShowToast({
        type: 'error',
        message: 'Debes seleccionar al menos un EPP incumplido.'
      });
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
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <button
            className="absolute top-6 right-6 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2.5 transition-all duration-200 hover:scale-105 z-60"
            onClick={onCancel}
          >
            <X size={22} />
          </button>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white pr-16">
              {isEdit ? 'Editar Reporte' : 'Nuevo Reporte de Infracción'}
            </h2>
            <p className="text-orange-100 mt-2">Documenta infracciones de EPP con precisión</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Descripción */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Descripción
              </label>
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200 resize-none hover:border-gray-300"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe la infracción observada (opcional)"
              />
            </div>

            {/* Imagen */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Imagen de evidencia <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-orange-400 transition-colors duration-200 group-hover:bg-orange-50/30">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="hidden"
                  id="image-upload"
                  //required={!isEdit}
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                    <Upload className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-gray-600 font-medium mb-1">Haz clic para subir una imagen</p>
                  <p className="text-sm text-gray-400">PNG, JPG hasta 10MB</p>
                </label>
              </div>

              {imagePreview && (
                <div className="mt-4 flex justify-center">
                  <div className="relative group/preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded-xl border-2 border-gray-200 object-cover shadow-md hover:shadow-lg transition-all duration-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cámara */}
            {camaras.length > 0 && (
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Cámara (opcional)
                </label>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200 bg-white hover:border-gray-300"
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
              </div>
            )}

            {/* EPP incumplidos */}
            <div className="group">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  EPP incumplidos <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:scale-105"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoriasEpp
                  .filter(epp => typeof epp.id === 'number' && !isNaN(Number(epp.id)))
                  .map((epp) => {
                    const id = Number(epp.id);
                    const checked = selectedEpp.includes(id);
                    const riskColor =
                      epp.nivel_riesgo === 'alto' ? 'text-red-600' :
                        epp.nivel_riesgo === 'medio' ? 'text-amber-600' :
                          'text-green-600';

                    return (
                      <label
                        key={id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${checked
                          ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-orange-200'
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
                          className="w-5 h-5 text-orange-600 rounded border-2 border-gray-300 focus:ring-orange-500"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">{epp.nombre}</span>
                          <div className={`text-xs font-medium ${riskColor} mt-1`}>
                            Riesgo {epp.nivel_riesgo}
                          </div>
                        </div>
                      </label>
                    );
                  })}
              </div>
            </div>

            {/* Estado del reporte */}
            {isEdit && user?.global_role === 'coordinador' && (
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Estado del reporte
                </label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200 bg-white hover:border-gray-300"
                  value={estado}
                  onChange={e => setEstado(e.target.value as 'pendiente' | 'en revision' | 'cerrado')}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en revision">En revisión</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:from-orange-600 hover:to-red-600 flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Guardando...
                  </>
                ) : (
                  isEdit ? 'Guardar cambios' : 'Crear Reporte'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className={`fixed left-1/2 -translate-x-1/2 bottom-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300 border-2 ${showToast.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-red-50 text-red-800 border-red-200'
            }`}>
            {showToast.type === 'success' ?
              <CheckCircle size={20} className="text-emerald-600" /> :
              <AlertCircle size={20} className="text-red-600" />
            }
            <span className="font-medium">{showToast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;