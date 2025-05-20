import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4">Página no encontrada</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <HomeIcon size={18} className="mr-2" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;