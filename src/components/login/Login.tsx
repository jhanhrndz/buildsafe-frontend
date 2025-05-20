// src/components/auth/Login.tsx
import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../../hooks/features/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const { loginLocal, loginGoogle, isLoading, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState({
    usuario: '',
    contrasena: '',
  });
  const navigate = useNavigate();

  // Si quieres limpiar el mensaje de error al desmontar o al cambiar inputs:
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Opcional: limpiar error al tipear
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Destructuramos por claridad
    const { usuario, contrasena } = credentials;

    // Validación mínima en cliente
    if (!usuario.trim() || !contrasena.trim()) {
      // Podrías usar un state local para errores de validación
      return;
    }

    const success = await loginLocal({ usuario, contrasena });
    if (success) {
      navigate('/');
    }
    // Si falla, `error` viene del hook y se muestra abajo
  };

  const handleGoogleLogin = async () => {
    const success = await loginGoogle();
    if (success) {
      //navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Iniciar Sesión
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Usuario */}
        <div>
          <label
            htmlFor="usuario"
            className="block text-sm font-medium text-gray-700"
          >
            Usuario
          </label>
          <input
            id="usuario"
            name="usuario"
            type="text"
            value={credentials.usuario}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm
                       focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tu nombre de usuario"
            autoComplete="username"
          />
        </div>

        {/* Campo Contraseña */}
        <div>
          <label
            htmlFor="contrasena"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            value={credentials.contrasena}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm
                       focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Botón de Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md
                     hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>

        {/* Link a registro */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">¿No tienes cuenta? </span>
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>

        {/* Separator */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              O continúa con
            </span>
          </div>
        </div>

        {/* Botón Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2
                     bg-white text-gray-700 py-2 px-4 rounded-md
                     border border-gray-300 hover:border-gray-400
                     hover:bg-gray-50 transition-colors"
        >
          <img
            src="/google-icon.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Google</span>
        </button>
      </form>
    </div>
  );
};
