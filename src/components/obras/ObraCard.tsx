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
  const { deleteObra } = useObra();

  // Función para manejar la eliminación
  const handleDelete = async () => {
    try {
      await deleteObra.mutateAsync(obra.id_obra);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar obra:", error);
    }
  };

  // Determinar icono y color según el estado
  const getStatusInfo = () => {
    switch (obra.estado) {
      case 'activo':
        return {
          icon: <Check size={16} />,
          color: 'bg-green-100 text-green-800'
        };
      case 'inactivo':
        return {
          icon: <Clock size={16} />,
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'finalizado':
        return {
          icon: <AlertTriangle size={16} />,
          color: 'bg-gray-100 text-gray-800'
        };
      default:
        return {
          icon: <Clock size={16} />,
          color: 'bg-blue-100 text-blue-800'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
        {/* Enlace como tarjeta principal */}
        <Link to={`/obras/${obra.id_obra}`} className="block p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 text-lg">{obra.nombre}</h3>

            {/* Menú de opciones (solo para coordinadores) */}
            {isCoordinador && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical size={18} />
                </button>

                {isMenuOpen && (
                  <div
                    className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md py-1 z-10 border border-gray-200"
                    onClick={(e) => e.preventDefault()}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit2 size={16} className="mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDeleteModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Descripción */}
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{obra.descripcion}</p>

          {/* Metadatos */}
          <div className="mt-4 flex flex-wrap gap-2">
            {obra.fecha_inicio && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(obra.fecha_inicio)}</span>
              </div>
            )}

            <div className={`flex items-center text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
              {statusInfo.icon}
              <span className="ml-1 capitalize">{obra.estado}</span>
            </div>
          </div>
        </Link>

        {/* Pie con acciones */}
        <div className="bg-gray-50 p-3 border-t border-gray-100">
          <Link
            to={`/obras/${obra.id_obra}/supervisores`}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Users size={16} className="mr-1" />
            <span>Ver equipo</span>
          </Link>
        </div>
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && (
        <ObraForm
          onClose={() => setIsEditModalOpen(false)}
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
          isLoading={deleteObra.isPending}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          variant="danger"
        />
      )}
    </>
  );
};

export default ObraCard;