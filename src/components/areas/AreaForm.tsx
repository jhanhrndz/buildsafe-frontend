// src/components/areas/AreaForm.tsx
import React, { useState, useEffect } from 'react';
import { X, MapPin, User, FileText } from 'lucide-react';
import type { Area, User as user } from '../../types/entities';

interface AreaFormProps {
  onClose: () => void;
  obraId: number;
  areaToEdit?: Area;
  onSubmit: (areaData: Omit<Area, 'id_area'> | Area) => void;
  isLoading?: boolean;
  supervisores?: user[]; // Lista de supervisores disponibles
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
    id_usuario: null,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 bg-opacity-40 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Modal */}
        <div className="bg-white rounded-2xl shadow-2xl transform transition-all w-full max-w-md border border-gray-100">
          {/* Header */}
          <div className="relative px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Editar área' : 'Nueva área'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-80 rounded-xl transition-all duration-200"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-6">
              {/* Nombre del área */}
              <div className="space-y-2">
                <label htmlFor="nombre" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>Nombre del área <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                    errors.nombre 
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                      : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100'
                  }`}
                  placeholder="Ingrese el nombre del área"
                />
                {errors.nombre && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    {errors.nombre}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label htmlFor="descripcion" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>Descripción</span>
                </label>
                <textarea
                  name="descripcion"
                  id="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 transition-all duration-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 resize-none"
                  placeholder="Descripción opcional del área"
                />
              </div>

              {/* Supervisor */}
              {supervisores.length > 0 && (
                <div className="space-y-2">
                  <label htmlFor="id_supervisor" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Supervisor asignado</span>
                  </label>
                  <select
                    name="id_supervisor"
                    id="id_supervisor"
                    value={formData.id_usuario || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 transition-all duration-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
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

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-4 ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading 
                    ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Guardando...</span>
                      </span>
                    )
                    : isEditing 
                      ? 'Guardar cambios' 
                      : 'Crear área'
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AreaForm;