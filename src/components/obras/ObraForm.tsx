// src/components/obras/ObraForm.tsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useObra } from '../../hooks/features/useObra';
import { useUserContext } from '../../context/UserContext';
import type { Obra } from '../../types/entities';

interface ObraFormProps {
  onClose: () => void;
  obraToEdit?: Obra;
}

const ObraForm = ({ onClose, obraToEdit }: ObraFormProps) => {
  const { user } = useUserContext();
  const { create, update, isLoading, error: obraError, clearError } = useObra();

  const isEditing = !!obraToEdit;

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    estado: 'activo' as 'activo' | 'inactivo' | 'finalizado',
    id_coordinador: user?.id_usuario || 0,
  });

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
    clearError(); // Limpiar errores al cargar
  }, [obraToEdit, user, clearError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      clearError();
      return;
    }

    try {
      if (isEditing && obraToEdit) {
        await update({
          ...obraToEdit,
          ...formData
        });
      } else {
        await create(formData);
      }
      
      onClose();
    } catch (err) {
      console.error('Error al guardar obra:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            {/* Campos del formulario... */}

            {/* Mensaje de error */}
            {obraError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
                {obraError}
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