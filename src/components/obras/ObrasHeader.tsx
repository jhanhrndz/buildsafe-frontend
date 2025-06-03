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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Title Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Obras</h1>
          <p className="text-gray-600">Gestiona y supervisa tus proyectos</p>
        </div>
        
        {/* Actions Section */}
        <div className="flex flex-col sm:flex-row gap-4 lg:w-auto w-full">
          {/* Search */}
          <div className="relative flex-1 lg:w-80">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar obras..."
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                         text-gray-900 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                         hover:bg-white transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* Create Button */}
          {isCoordinador && (
            <button
              onClick={onCreateClick}
              className="inline-flex items-center justify-center px-6 py-3 
                         bg-blue-600 text-white font-semibold rounded-xl 
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         active:scale-95 transition-all duration-200 
                         shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <PlusCircle size={20} className="mr-2" />
              Nueva Obra
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObrasHeader;