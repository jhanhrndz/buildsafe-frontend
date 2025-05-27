// src/components/obras/ObraCard.tsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Users, Calendar, Check, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useObra } from '../../hooks/features/useObra';
import ObraForm from './ObraForm';
import ConfirmDialog from '../shared/ConfirmDialog';
import type { Obra } from '../../types/entities';

interface ObraCardProps {
  obra: Obra;
  isCoordinador: boolean;
}

const ObraCard = ({ obra, isCoordinador }: ObraCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deleteObra, isLoading, error, clearError } = useObra();

  // Función para manejar la eliminación
  const handleDelete = async () => {
    try {
      await deleteObra(obra.id_obra);
      setIsDeleteModalOpen(false);
    } catch (error) {
      // El error ya está manejado por el hook, mantenemos el modal abierto
    }
  };

  // Determinar icono y color según el estado
  const getStatusInfo = () => {
    switch (obra.estado) {
      case 'activo':
        return {
          icon: <Check size={18} />,
          gradient: 'from-emerald-500 to-teal-600',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-200',
          dotColor: 'bg-emerald-500',
          shadowColor: 'shadow-emerald-100'
        };
      case 'inactivo':
        return {
          icon: <Clock size={18} />,
          gradient: 'from-amber-500 to-orange-600',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-200',
          dotColor: 'bg-amber-500',
          shadowColor: 'shadow-amber-100'
        };
      case 'finalizado':
        return {
          icon: <AlertTriangle size={18} />,
          gradient: 'from-slate-500 to-gray-600',
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-700',
          borderColor: 'border-slate-200',
          dotColor: 'bg-slate-500',
          shadowColor: 'shadow-slate-100'
        };
      default:
        return {
          icon: <Clock size={18} />,
          gradient: 'from-blue-500 to-indigo-600',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          dotColor: 'bg-blue-500',
          shadowColor: 'shadow-blue-100'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 ease-out overflow-hidden border border-gray-100/60 hover:border-gray-200/80 hover:-translate-y-1 backdrop-blur-sm">
        {/* Gradient Header Bar */}
        <div className={`h-1.5 bg-gradient-to-r ${statusInfo.gradient} opacity-80`} />
        
        {/* Main Card Content */}
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20 opacity-60" />
          
          {/* Content Container */}
          <div className="relative">
            {/* Header Section */}
            <div className="p-7 pb-4">
              <div className="flex justify-between items-start mb-5">
                <div className="flex-1 mr-4">
                  <Link to={`/obras/${obra.id_obra}`} className="block">
                    <h3 className="font-bold text-gray-900 text-xl leading-tight group-hover:text-gray-700 transition-colors duration-300 mb-2">
                      {obra.nombre}
                    </h3>
                  </Link>
                  
                  {/* Status Badge */}
                  <div className="inline-flex">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} border shadow-sm ${statusInfo.shadowColor}`}>
                      <span className={`w-2.5 h-2.5 rounded-full mr-3 ${statusInfo.dotColor} animate-pulse`} />
                      <span className="capitalize tracking-wide">{obra.estado}</span>
                    </span>
                  </div>
                </div>

                {/* Actions Menu (Coordinador only) */}
                {isCoordinador && (
                  <div className="relative z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(!isMenuOpen);
                      }}
                      className="p-3 rounded-xl hover:bg-gray-100/80 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105 backdrop-blur-sm"
                    >
                      <MoreVertical size={20} className="text-gray-500" />
                    </button>

                    {isMenuOpen && (
                      <div
                        className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl py-3 z-20 border border-gray-200/60"
                        onClick={(e) => e.preventDefault()}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-5 py-3 text-sm text-gray-700 hover:bg-gray-100/60 transition-all duration-200 hover:translate-x-1"
                        >
                          <Edit2 size={18} className="mr-4 text-gray-500" />
                          <span className="font-medium">Editar obra</span>
                        </button>
                        <div className="my-1 h-px bg-gray-200/60 mx-3" />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsDeleteModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-5 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-all duration-200 hover:translate-x-1"
                        >
                          <Trash2 size={18} className="mr-4 text-red-500" />
                          <span className="font-medium">Eliminar obra</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description Section */}
              <Link to={`/obras/${obra.id_obra}`} className="block">
                <div className="mb-6">
                  <p className="text-gray-600 text-base leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                    {obra.descripcion}
                  </p>
                </div>

                {/* Date Information */}
                {obra.fecha_inicio && (
                  <div className="flex items-center mb-1">
                    <div className="flex items-center text-sm text-gray-500 bg-gray-50/80 px-4 py-2.5 rounded-xl border border-gray-200/40 backdrop-blur-sm">
                      <Calendar size={16} className="mr-3 text-gray-400" />
                      <span className="font-medium">Inicio: {formatDate(obra.fecha_inicio)}</span>
                    </div>
                  </div>
                )}
              </Link>
            </div>

            {/* Footer Section */}
            <div className="bg-gradient-to-r from-gray-50/40 via-gray-50/60 to-gray-50/40 border-t border-gray-100/60 backdrop-blur-sm">
              <div className="p-6 pt-5">
                <Link
                  to={`/obras/${obra.id_obra}/supervisores`}
                  className="inline-flex items-center text-base text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 group/link hover:translate-x-1"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl mr-4 group-hover/link:bg-blue-100 transition-colors duration-300 group-hover/link:scale-105">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <span className="flex-1">Ver equipo de trabajo</span>
                  <ArrowRight size={18} className="ml-2 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && (
        <ObraForm
          onClose={() => {
            setIsEditModalOpen(false);
            clearError();
          }}
          obraToEdit={obra}
        />
      )}

      {/* Modal de confirmación para eliminar */}
      {isDeleteModalOpen && (
        <ConfirmDialog
          title="Eliminar obra"
          message={`¿Estás seguro que deseas eliminar la obra "${obra.nombre}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          isLoading={isLoading}
          onConfirm={handleDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            clearError();
          }}
          variant="danger"
        />
      )}
    </>
  );
};

export default ObraCard;