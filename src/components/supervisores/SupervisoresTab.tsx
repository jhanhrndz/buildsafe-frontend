import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Users, Mail, UserCheck, Shield, Award, Activity, TrendingUp } from 'lucide-react';
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
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSupervisores(obraId);
  }, [obraId, fetchSupervisores]);

  // Estadísticas de supervisores
  const supervisoresStats = {
    total: supervisores?.length || 0,
    conAreas: supervisores?.filter(s => s.areas.length > 0).length || 0,
    sinAreas: supervisores?.filter(s => s.areas.length === 0).length || 0,
    totalAreas: supervisores?.reduce((acc, s) => acc + s.areas.length, 0) || 0,
  };

  return (
    <div className="space-y-8 relative">
      {/* Enhanced Header Section */}
      <div className="relative space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-50 relative overflow-hidden">
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-black text-gray-700 tracking-tight  bg-clip-text mb-2">
                Supervisores de Obra
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl">
                Gestiona los supervisores asignados a esta obra y supervisa su trabajo en tiempo real
              </p>
            </div>
            {isCoordinador && (
              <button
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
                Asignar Supervisor
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">{supervisoresStats.total}</p>
                <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Total Supervisores</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-emerald-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Equipo activo</span>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl  p-8 shadow-sm hover:shadow-sm hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{supervisoresStats.conAreas}</p>
                <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Con Áreas</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600">
              <Activity className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Asignados</span>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 group-hover:text-amber-600 transition-colors duration-300">{supervisoresStats.totalAreas}</p>
                <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Áreas Totales</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-amber-600">
              <Shield className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Supervisadas</span>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-sm hover:shadow-gray-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 group-hover:text-gray-600 transition-colors duration-300">{supervisoresStats.sinAreas}</p>
                <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">Sin Asignar</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-gray-600">
              <Activity className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Pendientes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Error Alert */}
      {error && (
        <div className="relative rounded-2xl border border-red-200/50 bg-gradient-to-r from-red-50/80 to-red-100/30 backdrop-blur-sm p-8 shadow-sm transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 mb-2 text-lg">Error al cargar supervisores</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden">
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-bold text-emerald-600">Cargando supervisores...</p>
              <p className="text-gray-500">Obteniendo información del equipo</p>
            </div>
          </div>
        </div>
      ) : supervisores.length === 0 ? (
        /* Enhanced Empty State */
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-b border-emerald-300 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-700/20"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Equipo de Supervisores</h3>
                <p className="text-emerald-100 text-sm">Gestión de personal especializado</p>
              </div>
            </div>
          </div>
          
          <div className="p-16 text-center">
            <div className="mx-auto flex flex-col items-center space-y-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg flex items-center justify-center">
                <Users className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="space-y-4 max-w-md">
                <h3 className="text-2xl font-black text-gray-900">No hay supervisores asignados</h3>
                <p className="text-gray-600 leading-relaxed">
                  Asigna supervisores para mejorar el control y seguimiento del proyecto. 
                  Podrás gestionar sus permisos y áreas de trabajo de manera eficiente.
                </p>
              </div>
              {isCoordinador && (
                <button
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-10 py-5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Asignar primer supervisor
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Enhanced Supervisors Table */
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-b border-emerald-300 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-700/20"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Supervisores Asignados</h3>
                  <p className="text-emerald-100 text-sm">Control y seguimiento del equipo</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-2xl bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-bold text-white border border-white/20">
                {supervisores.length} Activos
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="divide-y divide-gray-100">
              {/* Desktop Table Header */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-6 px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-3">Supervisor</div>
                <div className="col-span-3">Contacto</div>
                <div className="col-span-4">Áreas Asignadas</div>
                <div className="col-span-2">Acciones</div>
              </div>

              {/* Table Rows */}
              {supervisores.map((sup, index) => (
                <div
                  key={sup.id_usuario}
                  className="group hover:bg-emerald-50/50 transition-all duration-300 rounded-2xl"
                  style={{ 
                    animation: `fadeInUp 0.5s ease-out`,
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Desktop Layout */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-6 px-4 py-8 items-center">
                    {/* Supervisor Info */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <UserCheck className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base group-hover:text-emerald-600 transition-colors duration-300">
                            {sup.nombres} {sup.apellidos}
                          </h4>
                          <p className="text-sm text-gray-500">ID: {sup.id_usuario}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 block">{sup.correo}</span>
                          <span className="text-xs text-gray-500">Correo principal</span>
                        </div>
                      </div>
                    </div>

                    {/* Areas */}
                    <div className="col-span-4">
                      {sup.areas.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {sup.areas.slice(0, 3).map((area, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1.5 text-xs font-bold text-blue-800 border border-blue-200 shadow-sm"
                              >
                                {area.nombre_area}
                              </span>
                            ))}
                            {sup.areas.length > 3 && (
                              <span className="inline-flex items-center rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-200 shadow-sm">
                                +{sup.areas.length - 3} más
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Shield className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {sup.areas.length} área{sup.areas.length !== 1 ? 's' : ''} supervisada{sup.areas.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <span className="inline-flex items-center rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 border border-amber-200">
                              Sin asignaciones
                            </span>
                            <p className="text-xs text-gray-500 mt-1">Pendiente de configuración</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      {isCoordinador && (
                        <button
                          className="group/btn inline-flex items-center gap-2 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                          onClick={() => setSupervisorToRemove(sup)}
                          title="Quitar supervisor"
                        >
                          <Trash2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                          <span className="text-sm font-medium">Quitar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Mobile Layout */}
                  <div className="lg:hidden px-6 py-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-lg">
                        <UserCheck className="h-8 w-8 text-emerald-600" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-gray-900 text-lg">
                            {sup.nombres} {sup.apellidos}
                          </h4>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 border border-green-200 shadow-sm">
                            Activo
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Mail className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{sup.correo}</span>
                          </div>
                          <div className="text-xs text-gray-500 ml-11">ID: {sup.id_usuario}</div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-500" />
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                              Áreas asignadas ({sup.areas.length})
                            </p>
                          </div>
                          {sup.areas.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {sup.areas.map((area, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-2 text-xs font-bold text-blue-800 border border-blue-200 shadow-sm"
                                >
                                  {area.nombre_area}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-flex items-center rounded-xl bg-amber-100 px-4 py-2 text-xs font-bold text-amber-800 border border-amber-200 shadow-sm">
                              Sin áreas asignadas
                            </span>
                          )}
                        </div>

                        {isCoordinador && (
                          <div className="pt-4 border-t border-gray-100">
                            <button
                              className="group/btn inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition-all duration-300 hover:bg-red-100 hover:border-red-300 shadow-sm hover:shadow-md"
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
            setToast({ type: 'success', message: 'Supervisor removido correctamente.' });
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
            setToast({ type: 'success', message: 'Supervisor asignado correctamente.' });
          }}
        />
      )}

      {/* Enhanced Toast Notifications */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 max-w-md w-full mx-4">
          <div 
            className={`rounded-2xl shadow-lg border backdrop-blur-md flex items-center gap-4 p-6 transform transition-all duration-500 ${
              toast.type === 'success' 
                ? 'bg-green-50/90 border-green-200/50 text-green-800' 
                : 'bg-red-50/90 border-red-200/50 text-red-800'
            }`}
            style={{ animation: 'toastSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              toast.type === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {toast.type === 'success' ? 
                <UserCheck className="w-6 h-6 text-white" /> : 
                <Activity className="w-6 h-6 text-white" />
              }
            </div>
            <div className="flex-1">
              <p className="font-semibold">{toast.message}</p>
            </div>
            <button 
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-200 hover:scale-110 ${
                toast.type === 'success' 
                  ? 'hover:bg-green-100 text-green-600' 
                  : 'hover:bg-red-100 text-red-600'
              }`}
              onClick={() => setToast(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SupervisoresTab;

// Enhanced Modal for adding supervisor by email
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
        className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg transform transition-all border border-white/20"
        style={{ animation: 'modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Enhanced Modal Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-700/20"></div>
          <div className="relative text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Asignar Supervisor</h3>
            <p className="text-emerald-100 leading-relaxed">Ingresa el correo del supervisor que deseas asignar a esta obra</p>
          </div>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Correo electrónico
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-focus-within:bg-emerald-200 transition-colors duration-200">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <input
                  type="email"
                  placeholder="supervisor@ejemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 font-medium placeholder-gray-500"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 ml-1">
                El supervisor recibirá una notificación de asignación
              </p>
            </div>
            
            {error && (
              <div className="rounded-2xl border border-red-200/50 bg-gradient-to-r from-red-50/80 to-red-100/30 backdrop-blur-sm p-4 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-200 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-red-700 font-medium text-sm">{error}</p>
                </div>
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 bg-white font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Asignando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Asignar Supervisor
                  </div>
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
            transform: scale(0.9) translateY(-20px);
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