import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No hay datos disponibles",
  message = "No se encontraron registros que coincidan con los criterios de búsqueda.",
  icon = <FileQuestion className="w-16 h-16" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-50 rounded-full p-6 mb-4">
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-center max-w-sm">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;