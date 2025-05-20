// src/components/shared/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  center?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  center = true 
}) => {
  // Determinar tamaño del spinner
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  // Determinar contenedor
  const containerClasses = center ? 'flex justify-center items-center p-6' : '';
  
  return (
    <div className={containerClasses}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 border-r-blue-600`} />
    </div>
  );
};

export default LoadingSpinner;