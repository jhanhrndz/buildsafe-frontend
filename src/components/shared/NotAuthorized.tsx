import { useNavigate } from 'react-router-dom';

export const NotAuthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold mb-4">Acceso no autorizado</h1>
      <p className="mb-4">No tienes permisos para ver esta página</p>
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Volver atrás
      </button>
    </div>
  );
};