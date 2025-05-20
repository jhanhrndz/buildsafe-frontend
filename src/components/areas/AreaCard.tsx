// src/components/areas/AreaCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Camera, ClipboardList, User } from 'lucide-react';
import type { Area, User as UserType } from '../../types/entities';

interface AreaCardProps {
  area: Area & { 
    supervisor?: UserType;
    camaras_count?: number;
    reportes_count?: number;
  };
  isCoordinador: boolean;
  onEdit?: (area: Area) => void;
  onDelete?: (areaId: number) => void;
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      {/* Cabecera de la tarjeta */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{area.nombre}</h3>
          
          {isCoordinador && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Opciones"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        if (onEdit) onEdit(area);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Edit size={16} className="mr-2" />
                      Editar área
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Eliminar área
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Cuerpo de la tarjeta */}
      <div className="p-4">
        {area.descripcion && (
          <p className="text-sm text-gray-600 mb-4">{area.descripcion}</p>
        )}
        
        {/* Información del supervisor */}
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <User size={16} className="mr-2" />
          <span>
            {area.supervisor 
              ? `${area.supervisor.nombres} ${area.supervisor.apellidos}`
              : 'Sin supervisor asignado'}
          </span>
        </div>
        
        {/* Contadores */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <Camera size={16} className="mr-1" />
            <span>{area.camaras_count || 0} cámaras</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <ClipboardList size={16} className="mr-1" />
            <span>{area.reportes_count || 0} reportes</span>
          </div>
        </div>
      </div>
      
      {/* Pie de la tarjeta con botones de acción */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <div className="flex justify-center">
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium transition-colors"
          >
            Ver detalles
          </button>
        </div>
      </div>
      
      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Eliminar área
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar el área "{area.nombre}"? Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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