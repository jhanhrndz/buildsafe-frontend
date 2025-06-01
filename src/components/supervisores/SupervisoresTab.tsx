import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Users, Mail, UserCheck } from 'lucide-react';
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Supervisores</h2>
          <p className="text-gray-600 leading-relaxed">
            Gestiona los supervisores asignados a esta obra y supervisa su trabajo
          </p>
        </div>
        {isCoordinador && (
          <button
            className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
            Asignar Supervisor
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100/50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-200 rounded-full animate-spin"></div>
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-emerald-600 font-medium">Cargando supervisores...</p>
        </div>
      ) : supervisores.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-16 text-center shadow-sm">
          <div className="mx-auto flex flex-col items-center space-y-6">
            <div className="rounded-full bg-white p-4 shadow-lg shadow-emerald-500/10">
              <Users className="h-12 w-12 text-emerald-500" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">No hay supervisores asignados</h3>
              <p className="text-gray-600 max-w-md leading-relaxed">
                Asigna supervisores para mejorar el control y seguimiento del proyecto. 
                Podrás gestionar sus permisos y áreas de trabajo.
              </p>
            </div>
            {isCoordinador && (
              <button
                className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
                Asignar primer supervisor
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Supervisors Table */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-b border-emerald-200">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-emerald-900">
                  Supervisores Asignados ({supervisores.length})
                </h3>
                <span className="inline-flex items-center rounded-full bg-emerald-200 px-4 py-1.5 text-sm font-semibold text-emerald-800">
                  Activos
                </span>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-gray-100">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-6 px-8 py-4 bg-gray-50/50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="col-span-3">Nombre Completo</div>
              <div className="col-span-3">Correo Electrónico</div>
              <div className="col-span-3">Áreas Asignadas</div>
              <div className="col-span-1">Acciones</div>
            </div>

            {/* Table Rows */}
            {supervisores.map((sup, index) => (
              <div
                key={sup.id_usuario}
                className="group hover:bg-emerald-50/30 transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-6 px-8 py-6 items-center">

                  {/* Nombre Completo */}
                  <div className="col-span-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 text-base">
                        {sup.nombres} {sup.apellidos}
                      </h4>
                      <p className="text-sm text-gray-500">ID: {sup.id_usuario}</p>
                    </div>
                  </div>

                  {/* Correo */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{sup.correo}</span>
                    </div>
                  </div>

                  {/* Áreas */}
                  <div className="col-span-3">
                    {sup.areas.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          {sup.areas.slice(0, 2).map((area, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 border border-blue-200"
                            >
                              {area.nombre_area}
                            </span>
                          ))}
                          {sup.areas.length > 2 && (
                            <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                              +{sup.areas.length - 2} más
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Total: {sup.areas.length} área{sup.areas.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200">
                        Sin asignaciones
                      </span>
                    )}
                  </div>


                  {/* Acciones */}
                  <div className="col-span-1">
                    {isCoordinador && (
                      <button
                        className="group/btn p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => setSupervisorToRemove(sup)}
                        title="Quitar supervisor"
                      >
                        <Trash2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden px-6 py-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-sm">
                      <UserCheck className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {sup.nombres} {sup.apellidos}
                        </h4>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                          Activo
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{sup.correo}</span>
                        </div>
                        <div className="text-xs text-gray-500">ID: {sup.id_usuario}</div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Áreas asignadas ({sup.areas.length})
                        </p>
                        {sup.areas.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {sup.areas.map((area, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 border border-blue-200"
                              >
                                {area.nombre_area}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                            Sin áreas asignadas
                          </span>
                        )}
                      </div>

                      {isCoordinador && (
                        <div className="pt-2">
                          <button
                            className="group/btn inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-100 hover:border-red-300"
                            onClick={() => setSupervisorToRemove(sup)}
                          >
                            <Trash2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                            Quitar supervisor
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
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

      {/* Add Supervisor Modal */}
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

// Modal for adding supervisor by email
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Plus className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Asignar Supervisor</h3>
            <p className="text-gray-600">Ingresa el correo del supervisor que deseas asignar a esta obra</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="supervisor@ejemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-lg shadow-emerald-500/25 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Asignando...
                  </div>
                ) : (
                  'Asignar Supervisor'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};