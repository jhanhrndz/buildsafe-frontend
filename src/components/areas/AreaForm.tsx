// src/components/areas/AreaForm.tsx
import React, { useState, useEffect } from 'react';
import { X, MapPin, User, FileText, Loader2 } from 'lucide-react';
import type { Area, User as user } from '../../types/entities';

interface AreaFormProps {
  onClose: () => void;
  obraId: number;
  areaToEdit?: Area;
  onSubmit: (areaData: Omit<Area, 'id_area'> | Area) => void;
  isLoading?: boolean;
  supervisores?: user[];
  isCoordinador?: boolean;
}

const AreaForm: React.FC<AreaFormProps> = ({
  onClose,
  obraId,
  areaToEdit,
  onSubmit,
  isLoading = false,
  supervisores = [],
  isCoordinador = false,
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
      [name]: name === 'id_usuario'
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

  console.log('AreaForm props:', { areaToEdit, supervisores, isCoordinador });

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <button
            className="absolute top-6 right-6 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2.5 transition-all duration-200 hover:scale-105 z-60"
            onClick={onClose}
          >
            <X size={22} />
          </button>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white pr-16">
              {isEditing ? 'Editar Área' : 'Nueva Área'}
            </h2>
            <p className="text-blue-100 mt-2">Gestiona las áreas de tu obra</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del área */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Nombre del área <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className={`w-full border-2 rounded-xl pl-10 pr-4 py-3 transition-all duration-200 hover:border-gray-300 ${
                    errors.nombre 
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                  }`}
                  placeholder="Ingrese el nombre del área"
                />
              </div>
              {errors.nombre && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mt-3 text-red-700 font-medium text-sm">
                  {errors.nombre}
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Descripción
              </label>
              <textarea
                name="descripcion"
                id="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                rows={3}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none hover:border-gray-300"
                placeholder="Descripción opcional del área"
              />
            </div>

            {/* Supervisor */}
            {isCoordinador && supervisores.length > 0 && (
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Supervisor asignado
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="id_usuario"
                    id="id_usuario"
                    value={formData.id_usuario || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white hover:border-gray-300"
                  >
                    <option value="">Sin asignar</option>
                    {supervisores.map((supervisor) => (
                      <option key={supervisor.id_usuario} value={supervisor.id_usuario}>
                        {`${supervisor.nombres} ${supervisor.apellidos}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Guardando...
                  </>
                ) : (
                  isEditing ? 'Guardar cambios' : 'Crear área'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AreaForm;