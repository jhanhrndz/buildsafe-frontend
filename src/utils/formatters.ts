// src/utils/formatters.ts
/**
 * Format a date string to a more human-readable format
 * @param dateString - ISO date string or any valid date input
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // Format: DD/MM/YYYY
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Format a number as currency
 * @param value - Number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value);
};

/**
 * Capitalize the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format a status string to a more readable format
 * @param status - Status string
 * @returns Formatted status string
 */
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'activo': 'Activo',
    'inactivo': 'Inactivo',
    'finalizado': 'Finalizado',
    'pendiente': 'Pendiente',
    'revisado': 'Revisado',
    'aprobado': 'Aprobado',
    'rechazado': 'Rechazado'
  };
  
  return statusMap[status] || capitalize(status);
};