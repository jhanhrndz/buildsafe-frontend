// src/components/areas/AreaDetalles.tsx
import React, { useState } from 'react';
import { ArrowLeft, User, Camera, ClipboardList, Edit, Trash2 } from 'lucide-react';
import type { Area, User as UserType } from '../../types/entities';
import CamaraList from '../camaras/CamaraList';
import AreaReportesTab from '../reportes/AreaReportesTab'; // <--- Importa el tab de reportes
import { useReportsContext } from '../../context/ReportsContext'; // Agrega esto arriba

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
  const { reportes } = useReportsContext(); // Usa el contexto global

  // Calcula el número real de reportes de esta área
  const reportesCount = reportes.filter(r => r.id_area === area.id_area).length;

const handleDelete = () => {
  if (onDelete) {
    onDelete(area.id_area); // Solo llama al handler del padre
  }
};

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Cabecera con navegación y acciones */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-white/60 rounded-lg transition-all duration-200"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{area.nombre}</h2>
            <p className="text-sm text-gray-500 mt-1">Detalles del área</p>
          </div>
        </div>
        
        {isCoordinador && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit && onEdit(area)}
              className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="Editar área"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="Eliminar área"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
      
      {/* Pestañas de navegación */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <nav className="flex px-6">
          <button
            className={`py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600 bg-white/60'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-white/40'
            }`}
            onClick={() => setActiveTab('info')}
          >
            Información
          </button>
          <button
            className={`ml-4 py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'camaras'
                ? 'border-blue-500 text-blue-600 bg-white/60'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-white/40'
            }`}
            onClick={() => setActiveTab('camaras')}
          >
            <span className="flex items-center">
              <Camera size={16} className="mr-2" />
              Cámaras 
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {area.camaras_count || 0}
              </span>
            </span>
          </button>
          <button
            className={`ml-4 py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'reportes'
                ? 'border-blue-500 text-blue-600 bg-white/60'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-white/40'
            }`}
            onClick={() => setActiveTab('reportes')}
          >
            <span className="flex items-center">
              <ClipboardList size={16} className="mr-2" />
              Reportes
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {reportesCount}
              </span>
            </span>
          </button>
        </nav>
      </div>
      
      {/* Contenido de la pestaña activa */}
      <div className="p-8">
        {activeTab === 'info' && (
          <div className="space-y-8">
            {/* Descripción */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Descripción
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {area.descripcion || 'No hay descripción disponible para esta área.'}
              </p>
            </div>
            
            {/* Supervisor */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Supervisor asignado
              </h3>
              <div className="flex items-center">
                <div className="bg-white shadow-sm rounded-xl p-3 mr-4">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium block">
                    {area.supervisor 
                      ? `${area.supervisor.nombres} ${area.supervisor.apellidos}`
                      : 'Sin supervisor asignado'}
                  </span>
                  {area.supervisor && (
                    <span className="text-sm text-gray-500">Supervisor del área</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Estadísticas */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Resumen estadístico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-blue-500 rounded-lg p-2 mr-3">
                        <Camera size={20} className="text-white" />
                      </div>
                      <span className="text-blue-700 font-semibold">Cámaras</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-800">{area.camaras_count || 0}</p>
                  <p className="text-sm text-blue-600 mt-1">Equipos instalados</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-green-500 rounded-lg p-2 mr-3">
                        <ClipboardList size={20} className="text-white" />
                      </div>
                      <span className="text-green-700 font-semibold">Reportes</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-800">{reportesCount}</p>
                  <p className="text-sm text-green-600 mt-1">Informes generados</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'camaras' && (
          <CamaraList area={area} />
        )}
        
        {activeTab === 'reportes' && (
          <AreaReportesTab areaId={area.id_area} />
        )}
      </div>
    </div>
  );
};

export default AreaDetalles;