// src/pages/obras/ObrasPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useObra } from '../../hooks/features/useObra';
import { useUserContext } from '../../context/UserContext';
import { useDashboardContext } from '../../components/dashboard/DashboardLayout';
import ObraCard from '../../components/obras/ObraCard';
import ObrasHeader from '../../components/obras/ObrasHeader';
import ObraForm from '../../components/obras/ObraForm';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import type { Obra } from '../../types/entities';

const ObrasPage = () => {
  const { updateTitle } = useDashboardContext();
  const { user } = useUserContext();
  const { obras, isLoading, error, refresh } = useObra();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isCoordinador = user?.global_role === 'coordinador';

  useEffect(() => {
    updateTitle('Gestión de Obras');
    return () => updateTitle('');
  }, [updateTitle]);

  const filteredObras = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return obras?.filter(o =>
      o.nombre.toLowerCase().includes(term) ||
      o.descripcion?.toLowerCase().includes(term)
    ) || [];
  }, [obras, searchTerm]);

  const handleCreateSuccess = () => {
    refresh();
  };

  const renderEmptyState = () => {
    const hasSearch = Boolean(searchTerm.trim());
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        {hasSearch ? (
          <>
            <p className="text-gray-600 mb-2">
              No se encontraron obras con "{searchTerm}"
            </p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-blue-600 hover:text-blue-800"
            >
              Limpiar búsqueda
            </button>
          </>
        ) : (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay obras registradas
            </h3>
            <p className="text-gray-600 mb-4">
              {isCoordinador
                ? 'Comienza creando tu primera obra para gestionar tus proyectos de construcción.'
                : 'Aún no tienes obras asignadas como supervisor.'}
            </p>
            {isCoordinador && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Crear primera obra
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <ObrasHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={() => setIsCreateModalOpen(true)}
        isCoordinador={isCoordinador}
      />

      {filteredObras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredObras.map(obra => (
            <ObraCard
              key={obra.id_obra}
              obra={obra}
              isCoordinador={isCoordinador}
            />
          ))}
        </div>
      ) : (
        renderEmptyState()
      )}

      {isCreateModalOpen && (
        <ObraForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default ObrasPage;