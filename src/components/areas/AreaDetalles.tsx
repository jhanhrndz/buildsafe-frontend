// src/components/areas/AreaDetalles.tsx
import React, { useState } from 'react';
import { ArrowLeft, User, Camera, ClipboardList, Edit, Trash2 } from 'lucide-react';
import type { Area, User as UserType } from '../../types/entities';

interface AreaDetallesProps {
  area: Area & {
    supervisor?: UserType;
    camaras_count?: number;
    reportes_count?: number;
  };
  isCoordinador: boolean;
  onBack: () => void;
  onEdit?: (area: Area) => void;
  onDelete?: (areaId: number) => void;
}

const AreaDetalles: React.FC<AreaDetallesProps> = ({
  area,
  isCoordinador,
  onBack,
  onEdit,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'camaras' | 'reportes'>('info');

  const handleDelete = () => {
    if (onDelete && window.confirm(`¿Estás seguro de que deseas eliminar el área "${area.nombre}"? Esta acción no se puede deshacer.`)) {
      onDelete(area.id_area);
      onBack(); // Volver a la lista después de eliminar
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cabecera con navegación y acciones */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-3 text-gray-500 hover:text-gray-700"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-medium text-gray-900">{area.nombre}</h2>
        </div>
        
        {isCoordinador && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit && onEdit(area)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              aria-label="Editar área"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              aria-label="Eliminar área"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
      
      {/* Pestañas de navegación */}
      <div className="border-b border-gray-200">
        <nav className="flex px-6">
          <button
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('info')}
          >
            Información
          </button>
          <button
            className={`ml-8 py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'camaras'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('camaras')}
          >
            Cámaras ({area.camaras_count || 0})
          </button>
          <button
            className={`ml-8 py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'reportes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('reportes')}
          >
            Reportes ({area.reportes_count || 0})
          </button>
        </nav>
      </div>
      
      {/* Contenido de la pestaña activa */}
      <div className="p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Descripción */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
              <p className="text-gray-900">
                {area.descripcion || 'No hay descripción disponible para esta área.'}
              </p>
            </div>
            
            {/* Supervisor */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Supervisor asignado</h3>
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <User size={18} className="text-gray-600" />
                </div>
                <span className="text-gray-900">
                  {area.supervisor 
                    ? `${area.supervisor.nombres} ${area.supervisor.apellidos}`
                    : 'Sin supervisor asignado'}
                </span>
              </div>
            </div>
            
            {/* Estadísticas */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Resumen</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Camera size={18} className="text-blue-600 mr-2" />
                    <span className="text-blue-600 font-medium">Cámaras</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-blue-800">{area.camaras_count || 0}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <ClipboardList size={18} className="text-green-600 mr-2" />
                    <span className="text-green-600 font-medium">Reportes</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-green-800">{area.reportes_count || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'camaras' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center">
            <Camera size={40} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Monitoreo de cámaras</h3>
            <p className="text-gray-600 mb-6">Aquí podrás ver todas las cámaras instaladas en esta área.</p>
            {/* Contenido pendiente de implementación */}
          </div>
        )}
        
        {activeTab === 'reportes' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center">
            <ClipboardList size={40} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Reportes de seguridad</h3>
            <p className="text-gray-600 mb-6">Gestiona los reportes de incidencias y seguridad para esta área.</p>
            {/* Contenido pendiente de implementación */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaDetalles;