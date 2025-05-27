// src/components/obras/ObraForm.tsx
import React, { useState, useEffect } from 'react';
import { X, Building2, Calendar, FileText, Settings } from 'lucide-react';
import { useObra } from '../../hooks/features/useObra';
import { useUserContext } from '../../context/UserContext';
import type { Obra } from '../../types/entities';

interface ObraFormProps {
  onClose: () => void;
  obraToEdit?: Obra;
  onSuccess?: () => void;
}

const ObraForm = ({ onClose, obraToEdit, onSuccess }: ObraFormProps) => {
  const { user } = useUserContext();
  const { createObra, updateObra, isLoading, error: obraError, clearError } = useObra();

  const isEditing = !!obraToEdit;

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    estado: 'activo' as 'activo' | 'inactivo' | 'finalizado',
    id_coordinador: user?.id_usuario || 0,
  });

  useEffect(() => {
    if (obraToEdit) {
      setFormData({
        nombre: obraToEdit.nombre,
        descripcion: obraToEdit.descripcion || '',
        fecha_inicio: obraToEdit.fecha_inicio || '',
        estado: obraToEdit.estado,
        id_coordinador: obraToEdit.id_coordinador,
      });
    }
    clearError();
  }, [obraToEdit, clearError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        await updateObra({ ...obraToEdit, ...formData });
      } else {
        await createObra(formData);
      }
      
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('Error al guardar obra:', err);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'text-green-600 bg-green-50';
      case 'inactivo': return 'text-gray-600 bg-gray-50';
      case 'finalizado': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative bg-white rounded-2xl shadow-2xl transform transition-all sm:max-w-2xl sm:w-full overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {isEditing ? 'Editar Obra' : 'Nueva Obra'}
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  {isEditing ? 'Modifica los datos de la obra' : 'Crea una nueva obra en el sistema'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Nombre */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Building2 size={16} className="text-blue-600" />
                  Nombre de la obra
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  placeholder="Ingresa el nombre de la obra"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText size={16} className="text-blue-600" />
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white resize-none"
                  placeholder="Describe brevemente la obra (opcional)"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fecha de inicio */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Calendar size={16} className="text-blue-600" />
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  />
                </div>

                {/* Estado */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Settings size={16} className="text-blue-600" />
                    Estado del proyecto
                  </label>
                  <div className="space-y-3">
                    {(['activo', 'inactivo', 'finalizado'] as const).map((estado) => (
                      <label key={estado} className="flex items-center gap-3 cursor-pointer group/radio">
                        <div className="relative">
                          <input
                            type="radio"
                            name="estado"
                            value={estado}
                            checked={formData.estado === estado}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                            formData.estado === estado 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300 group-hover/radio:border-gray-400'
                          }`}>
                            {formData.estado === estado && (
                              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                            estado === 'activo' ? 'bg-green-100 text-green-700 border border-green-200' :
                            estado === 'inactivo' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                            'bg-blue-100 text-blue-700 border border-blue-200'
                          } ${formData.estado === estado ? 'ring-2 ring-blue-200' : ''}`}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                estado === 'activo' ? 'bg-green-500' :
                                estado === 'inactivo' ? 'bg-gray-500' :
                                'bg-blue-500'
                              }`}></div>
                              {estado.charAt(0).toUpperCase() + estado.slice(1)}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {estado === 'activo' && 'Proyecto en desarrollo'}
                            {estado === 'inactivo' && 'Temporalmente pausado'}
                            {estado === 'finalizado' && 'Proyecto completado'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {obraError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X size={12} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Error al procesar la solicitud</p>
                  <p className="text-sm mt-1">{obraError}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium disabled:opacity-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Guardando...
                  </span>
                ) : (
                  isEditing ? 'Actualizar Obra' : 'Crear Obra'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ObraForm;