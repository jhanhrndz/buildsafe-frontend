// src/components/areas/AreaForm.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Area, User } from '../../types/entities';

interface AreaFormProps {
  onClose: () => void;
  obraId: number;
  areaToEdit?: Area;
  onSubmit: (areaData: Omit<Area, 'id_area'> | Area) => void;
  isLoading?: boolean;
  supervisores?: User[]; // Lista de supervisores disponibles
}

const AreaForm: React.FC<AreaFormProps> = ({
  onClose,
  obraId,
  areaToEdit,
  onSubmit,
  isLoading = false,
  supervisores = [],
}) => {
  const [formData, setFormData] = useState<Omit<Area, 'id_area'> | Area>({
    id_obra: obraId,
    nombre: '',
    descripcion: '',
    id_supervisor: null,
  });

  const [errors, setErrors] = useState<{
    nombre?: string;
  }>({});

  useEffect(() => {
    if (areaToEdit) {
      setFormData({
        ...areaToEdit,
      });
    }
  }, [areaToEdit]);

  const validateForm = (): boolean => {
    const newErrors: { nombre?: string } = {};
    let isValid = true;

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del área es obligatorio';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'id_supervisor' 
        ? (value === '' ? null : parseInt(value, 10)) 
        : value,
    });
    
    // Limpiar error al escribir
    if (name === 'nombre' && errors.nombre) {
      setErrors({ ...errors, nombre: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const isEditing = !!areaToEdit;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isEditing ? 'Editar área' : 'Nueva área'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-5">
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                    Nombre del área <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full border ${errors.nombre ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    id="descripcion"
                    value={formData.descripcion || ''}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {supervisores.length > 0 && (
                  <div>
                    <label htmlFor="id_supervisor" className="block text-sm font-medium text-gray-700">
                      Supervisor asignado
                    </label>
                    <select
                      name="id_supervisor"
                      id="id_supervisor"
                      value={formData.id_supervisor || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Sin asignar</option>
                      {supervisores.map((supervisor) => (
                        <option key={supervisor.id_usuario} value={supervisor.id_usuario}>
                          {`${supervisor.nombres} ${supervisor.apellidos}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mx-2 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading 
                  ? 'Guardando...' 
                  : isEditing 
                    ? 'Guardar cambios' 
                    : 'Crear área'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AreaForm;