import { useState } from 'react';
import { useAuth } from '../../hooks/features/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const { loginLocal, loginGoogle, isLoading, error } = useAuth();
  const [credentials, setCredentials] = useState({
    usuario: '',
    contrasena: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginLocal(credentials);
    if (success) navigate('/');
  };

  // src/components/auth/Login.tsx
  const handleGoogleLogin = async () => {
    console.log('Iniciando autenticación con Google...');
    try {
      const success = await loginGoogle();
      if (success) {
        console.log('Autenticación Google exitosa, redirigiendo...');
      }
    } catch (error) {
      console.error('Error completo en Google Login:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos del formulario... */}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-600">¿No tienes cuenta? </span>
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
          <span>Google</span>
        </button>
      </form>
    </div>
  );
};