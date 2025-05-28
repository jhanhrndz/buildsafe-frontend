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
                        onClick={() => {
                          if (onDelete) onDelete(area.id_area);
                          setIsMenuOpen(false);
                        }}
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
              <p className="text-lg font-semibold text-gray-900">
                {area.camaras_count || 0} cámaras
              </p>
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


    </div>
  );
};

export default AreaCard;