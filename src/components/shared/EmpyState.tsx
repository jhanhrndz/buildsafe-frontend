// src/components/shared/EmptyState.tsx
import React from 'react';
import { BoxIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  action, 
  icon = <BoxIcon size={40} className="text-gray-400" />
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center my-4">
      <div className="flex flex-col items-center">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-md">{message}</p>
        {action && (
          <div className="mt-6">
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {action.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;