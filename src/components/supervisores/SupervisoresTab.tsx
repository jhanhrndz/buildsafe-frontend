import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { useSupervisores } from '../../context/SupervisoresContext';
import type { SupervisorWithAreas } from '../../types/entities';
import ConfirmDialog from '../shared/ConfirmDialog';

interface SupervisoresTabProps {
  obraId: number;
  isCoordinador: boolean;
}

const SupervisoresTab: React.FC<SupervisoresTabProps> = ({ obraId, isCoordinador }) => {
  const { supervisores, loading, error, fetchSupervisores, asignarSupervisor, quitarSupervisor } = useSupervisores();
  const [showAddModal, setShowAddModal] = useState(false);
  const [supervisorToRemove, setSupervisorToRemove] = useState<SupervisorWithAreas | null>(null);

  useEffect(() => {
    fetchSupervisores(obraId);
  }, [obraId, fetchSupervisores]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supervisores</h2>
          <p className="mt-1 text-sm text-gray-600">Gestiona los supervisores asignados a esta obra</p>
        </div>
        {isCoordinador && (
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4" />
            Asignar Supervisor
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      ) : supervisores.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay supervisores asignados</h3>
          <p className="text-gray-600 mb-4">Asigna supervisores para mejorar el control y seguimiento del proyecto</p>
          {isCoordinador && (
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4" />
              Asignar primer supervisor
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white shadow-sm">
          {supervisores.map((sup) => (
            <li key={sup.id_usuario} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4">
              <div>
                <div className="font-semibold text-gray-900">{sup.nombres} {sup.apellidos}</div>
                <div className="text-sm text-gray-500">{sup.correo}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Áreas: {sup.areas.length > 0 ? sup.areas.map(a => a.nombre_area).join(', ') : 'Sin áreas asignadas'}
                </div>
              </div>
              {isCoordinador && (
                <button
                  className="mt-3 sm:mt-0 inline-flex items-center gap-2 text-red-600 hover:underline"
                  onClick={() => setSupervisorToRemove(sup)}
                >
                  <Trash2 className="h-4 w-4" />
                  Quitar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Confirmación de eliminación */}
      {supervisorToRemove && (
        <ConfirmDialog
          title="Quitar supervisor"
          message={`¿Seguro que deseas quitar a ${supervisorToRemove.nombres} ${supervisorToRemove.apellidos} de la obra?`}
          confirmLabel="Quitar"
          cancelLabel="Cancelar"
          variant="danger"
          isLoading={loading}
          onConfirm={async () => {
            await quitarSupervisor(obraId, supervisorToRemove.id_usuario);
            setSupervisorToRemove(null);
          }}
          onCancel={() => setSupervisorToRemove(null)}
        />
      )}

      {showAddModal && (
        <AddSupervisorModal
          obraId={obraId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchSupervisores(obraId);
          }}
        />
      )}
    </div>
  );
};

export default SupervisoresTab;

// Modal para agregar supervisor por email
const AddSupervisorModal: React.FC<{
  obraId: number;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ obraId, onClose, onSuccess }) => {
  const { asignarSupervisor, loading } = useSupervisores();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('El correo es obligatorio');
      return;
    }
    try {
      await asignarSupervisor(obraId, email.trim());
      onSuccess();
    } catch (err: any) {
      setError('No se pudo asignar el supervisor');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Asignar Supervisor</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo del supervisor"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
            disabled={loading}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};