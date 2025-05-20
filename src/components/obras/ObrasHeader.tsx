// src/components/obras/ObrasHeader.tsx
import { Search, PlusCircle } from 'lucide-react';

interface ObrasHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  isCoordinador: boolean;
}

const ObrasHeader = ({
  searchTerm,
  onSearchChange,
  onCreateClick,
  isCoordinador
}: ObrasHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-lg shadow-sm">
      {/* Título */}
      <h1 className="text-xl font-semibold text-gray-800">Obras</h1>
      
      {/* Buscador y botón */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar obras..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <span className="text-lg">&times;</span>
            </button>
          )}
        </div>
        
        {/* Botón de nueva obra (solo para coordinadores) */}
        {isCoordinador && (
          <button
            onClick={onCreateClick}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <PlusCircle size={18} className="mr-2" />
            <span>Nueva Obra</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ObrasHeader;