// src/components/obras/ObrasEmptyState.tsx
interface ObrasEmptyStateProps {
  searchTerm: string;
  isCoordinador: boolean;
  onResetSearch: () => void;
  onCreateClick?: () => void;
}

const ObrasEmptyState: React.FC<ObrasEmptyStateProps> = ({
  searchTerm,
  isCoordinador,
  onResetSearch,
  onCreateClick
}) => {
  const hasSearch = searchTerm.trim().length > 0;

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
      {hasSearch ? (
        <>
          <p className="text-gray-600 mb-2">No se encontraron obras con "{searchTerm}"</p>
          <button onClick={onResetSearch} className="text-blue-600 hover:text-blue-800">
            Limpiar búsqueda
          </button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay obras registradas</h3>
          <p className="text-gray-600 mb-4">
            {isCoordinador ? 'Comienza creando tu primera obra.' : 'Aún no tienes obras asignadas.'}
          </p>
          {isCoordinador && onCreateClick && (
            <button onClick={onCreateClick} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Crear primera obra
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ObrasEmptyState;
