// src/components/obras/ObrasHeader.tsx
import { Search, PlusCircle, X, Building2, TrendingUp } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-sm border border-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50/40 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-500/25 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-700 tracking-tight bg-clip-text mb-2">
                Centro de Obras
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Gestiona y supervisa todos tus proyectos de construcción desde un solo lugar
              </p>
            </div>
          </div>
          
          {/* Quick Stats Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-blue-50/80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-blue-100/50">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Gestión integral</span>
          </div>
        </div>
      </div>

      {/* Enhanced Actions Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="bg-blue-600 px-8 py-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Explorar Obras</h3>
                <p className="text-blue-100 text-sm">Encuentra y gestiona tus proyectos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Enhanced Search */}
            <div className="flex-1 lg:max-w-2xl">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                <div className="relative">
                  <Search size={24} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar obras por nombre, ubicación o estado..."
                    className="w-full pl-16 pr-16 py-5 bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl 
                               text-gray-900 placeholder-gray-500 text-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 focus:bg-white/90
                               hover:bg-white/70 hover:border-gray-300/70 transition-all duration-300
                               group-hover:shadow-lg group-hover:shadow-blue-500/10"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 
                                 w-8 h-8 rounded-xl bg-gray-200/80 hover:bg-gray-300/80 
                                 flex items-center justify-center
                                 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Enhanced Create Button */}
            {isCoordinador && (
              <div className="group">
                <button
                  onClick={onCreateClick}
                  className="inline-flex items-center justify-center px-8 py-5 
                             bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl text-lg
                             hover:from-blue-700 hover:to-blue-800 
                             focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2
                             active:scale-95 transition-all duration-300 
                             shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30
                             hover:-translate-y-1 whitespace-nowrap relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <PlusCircle size={24} className="mr-3 relative z-10" />
                  <span className="relative z-10">Nueva Obra</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObrasHeader;