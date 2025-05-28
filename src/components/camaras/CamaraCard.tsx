import React from 'react';
import type { Camara } from '../../types/entities';

interface CamaraCardProps {
  camara: Camara;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const CamaraCard: React.FC<CamaraCardProps> = ({ camara, canEdit, onEdit, onDelete }) => (
  <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <span className="font-semibold">{camara.nombre}</span>
      <span className={`text-xs px-2 py-1 rounded ${camara.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
        {camara.estado === 'activo' ? 'Activa' : 'Inactiva'}
      </span>
    </div>
    <div className="text-sm text-gray-500">IP: {camara.ip_stream}</div>
    <div className="text-xs text-gray-400">Última conexión: {camara.ultima_conexion || 'N/A'}</div>
    {canEdit && (
      <div className="flex gap-2 mt-2">
        <button className="text-blue-600 hover:underline" onClick={onEdit}>Editar</button>
        <button className="text-red-600 hover:underline" onClick={onDelete}>Eliminar</button>
      </div>
    )}
  </div>
);

export default CamaraCard;