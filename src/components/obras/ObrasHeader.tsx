// src/components/obras/ObrasHeader.tsx
import { Search, PlusCircle, X } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Título */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Obras</h1>
        </div>
        
        {/* Buscador y botón */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Buscador */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar obras..."
              className="block w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-lg 
                         text-gray-900 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         hover:border-gray-300 transition-all duration-200
                         shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 
                           hover:text-gray-600 transition-colors duration-200"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* Botón de nueva obra (solo para coordinadores) */}
          {isCoordinador && (
            <button
              onClick={onCreateClick}
              className="inline-flex items-center justify-center px-6 py-3 
                         bg-gradient-to-r from-blue-600 to-blue-700 
                         text-white font-medium rounded-lg 
                         hover:from-blue-700 hover:to-blue-800 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         active:scale-[0.98]
                         transition-all duration-200 
                         shadow-sm hover:shadow-md
                         w-full sm:w-auto"
            >
              <PlusCircle size={18} className="mr-2" />
              <span>Nueva Obra</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObrasHeader;