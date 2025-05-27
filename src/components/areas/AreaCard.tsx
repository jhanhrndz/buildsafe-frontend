// src/components/areas/AreaCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Camera, ClipboardList, User, MoreVertical } from 'lucide-react';
import type { Area, User as UserType } from '../../types/entities';

interface AreaCardProps {
  area: Area & { 
    supervisor?: UserType;
    camaras_count?: number;
    reportes_count?: number;
  };
  obraId: number;
  isCoordinador: boolean;
  onEdit?: (area: Area) => void;
  onDelete?: (areaId: number) => void;
  onViewDetails?: (areaId: number) => void;
}

const AreaCard: React.FC<AreaCardProps> = ({
  area,
  isCoordinador,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setIsMenuOpen(false);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(area.id_area);
    }
    setShowDeleteConfirm(false);
  };
  
  const handleViewDetails = () => {
    // Navegar directamente a la ruta del área
    navigate(`/areas/${area.id_area}`);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
      {/* Cabecera de la tarjeta */}
      <div className="relative p-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
              {area.nombre}
            </h3>
            {area.descripcion && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                {area.descripcion}
              </p>
            )}
          </div>
          
          {isCoordinador && (
            <div className="relative ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Opciones"
              >
                <MoreVertical size={18} />
              </button>
              
              {isMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200 overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          if (onEdit) onEdit(area);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors"
                      >
                        <Edit size={16} className="mr-3" />
                        Editar área
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left transition-colors"
                      >
                        <Trash2 size={16} className="mr-3" />
                        Eliminar área
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Cuerpo de la tarjeta */}
      <div className="p-5 space-y-4">
        {/* Información del supervisor */}
        <div className="flex items-center p-3 bg-gray-50/70 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">Supervisor</p>
            <p className="text-sm text-gray-600">
              {area.supervisor 
                ? `${area.supervisor.nombres} ${area.supervisor.apellidos}`
                : 'Sin supervisor asignado'}
            </p>
          </div>
        </div>
        
        {/* Contadores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center p-3 bg-green-50/70 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Camera size={16} className="text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-lg font-semibold text-gray-900">{area.camaras_count || 0}</p>
              <p className="text-xs text-gray-600">Cámaras</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-orange-50/70 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <ClipboardList size={16} className="text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-lg font-semibold text-gray-900">{area.reportes_count || 0}</p>
              <p className="text-xs text-gray-600">Reportes</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pie de la tarjeta con botones de acción */}
      <div className="p-5 pt-0">
        <button
          onClick={handleViewDetails}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium text-sm transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2"
        >
          Ver detalles
        </button>
      </div>
      
      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
              onClick={() => setShowDeleteConfirm(false)}
            />

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-semibold text-gray-900">
                      Eliminar área
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        ¿Estás seguro de que deseas eliminar el área <span className="font-medium text-gray-900">"{area.nombre}"</span>? Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:gap-3">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full cursor-pointer inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors sm:w-auto"
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaCard;