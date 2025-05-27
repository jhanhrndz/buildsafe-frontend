// src/components/obras/ObraCard.tsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Users, Calendar, Check, Clock, AlertTriangle } from 'lucide-react';
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
          icon: <Check size={16} />,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dotColor: 'bg-emerald-400'
        };
      case 'inactivo':
        return {
          icon: <Clock size={16} />,
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          dotColor: 'bg-amber-400'
        };
      case 'finalizado':
        return {
          icon: <AlertTriangle size={16} />,
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          dotColor: 'bg-slate-400'
        };
      default:
        return {
          icon: <Clock size={16} />,
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          dotColor: 'bg-blue-400'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 relative">
        {/* Accent bar */}
        <div className={`h-1 ${statusInfo.dotColor}`} />
        
        {/* Enlace como tarjeta principal */}
        <Link to={`/obras/${obra.id_obra}`} className="block p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 mr-4">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-gray-700 transition-colors">
                {obra.nombre}
              </h3>
            </div>

            {/* Menú de opciones (solo para coordinadores) */}
            {isCoordinador && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical size={18} className="text-gray-500" />
                </button>

                {isMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-lg py-2 z-10 border border-gray-200"
                    onClick={(e) => e.preventDefault()}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 size={16} className="mr-3 text-gray-500" />
                      Editar obra
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDeleteModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} className="mr-3 text-red-500" />
                      Eliminar obra
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Estado badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${statusInfo.dotColor}`} />
              <span className="capitalize">{obra.estado}</span>
            </span>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {obra.descripcion}
          </p>

          {/* Metadatos */}
          <div className="flex items-center">
            {obra.fecha_inicio && (
              <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Calendar size={14} className="mr-2 text-gray-400" />
                <span className="font-medium">{formatDate(obra.fecha_inicio)}</span>
              </div>
            )}
          </div>
        </Link>

        {/* Pie con acciones */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-50/80 px-6 py-4 border-t border-gray-100">
          <Link
            to={`/obras/${obra.id_obra}/supervisores`}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors group/link"
          >
            <Users size={16} className="mr-2 group-hover/link:scale-105 transition-transform" />
            <span>Ver equipo de trabajo</span>
          </Link>
        </div>
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