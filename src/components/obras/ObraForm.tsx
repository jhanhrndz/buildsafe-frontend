// src/components/obras/ObraForm.tsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useObra} from '../../hooks/features/useObra';
import { useUserContext } from '../../context/UserContext';
import type { Obra } from '../../types/entities';

interface ObraFormProps {
  onClose: () => void;
  obraToEdit?: Obra;
}

const ObraForm = ({ onClose, obraToEdit }: ObraFormProps) => {
  const { user } = useUserContext();
  const { createObra, updateObra } = useObra();

  const isEditing = !!obraToEdit;

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    estado: 'activo' as 'activo' | 'inactivo' | 'finalizado',
    id_coordinador: user?.id_usuario || 0,
  });

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (obraToEdit) {
      setFormData({
        nombre: obraToEdit.nombre || '',
        descripcion: obraToEdit.descripcion || '',
        fecha_inicio: obraToEdit.fecha_inicio || '',
        estado: obraToEdit.estado || 'activo',
        id_coordinador: obraToEdit.id_coordinador || user?.id_usuario || 0,
      });
    }
  }, [obraToEdit, user]);

  // Función para manejar cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  // Función para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre.trim()) {
      setError('El nombre de la obra es obligatorio');
      return;
    }

    try {
      if (isEditing && obraToEdit) {
        // Actualizar obra existente
        await updateObra.mutateAsync({
          id_obra: obraToEdit.id_obra,
          ...formData
        });
      } else {
        // Crear nueva obra
        await createObra.mutateAsync(formData);
      }
      
      onClose();
    } catch (err) {
      setError('Ocurrió un error al guardar la obra. Intente nuevamente.');
      console.error('Error al guardar obra:', err);
    }
  };

  // Determinar si estamos cargando
  const isLoading = createObra.isPending || updateObra.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              {isEditing ? 'Editar Obra' : 'Nueva Obra'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Nombre */}
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre de la obra"
              />
            </div>

            {/* Descripción */}
            <div className="mb-4">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción de la obra"
              />
            </div>

            {/* Fecha de inicio */}
            <div className="mb-4">
              <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio
              </label>
              <input
                type="date"
                id="fecha_inicio"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Estado */}
            <div className="mb-4">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
                {error}
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? 
                  'Guardando...' : 
                  isEditing ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ObraForm;