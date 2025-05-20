// src/components/shared/ErrorMessage.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, action }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm my-4 border border-red-100">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-gray-700">
            <p>{message}</p>
          </div>
          {action && (
            <div className="mt-4">
              <button
                type="button"
                onClick={action.onClick}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;