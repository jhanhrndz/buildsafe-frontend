// src/components/auth/Login.tsx
import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../../hooks/features/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle, Building } from 'lucide-react';

// Importamos el componente GoogleButton mejorado
import GoogleButton from '../../components/shared/GoogleButton';

export const Login = () => {
  const { loginLocal, loginGoogle, isLoading, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState({
    usuario: '',
    contrasena: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { usuario, contrasena } = credentials;

    if (!usuario.trim() || !contrasena.trim()) {
      return;
    }

    const success = await loginLocal({ usuario, contrasena });
    if (success) {
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    const success = await loginGoogle();
    if (success) {
      //navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        {/* Card con efecto glassmorphism */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          {/* Sección izquierda - Logo y título */}
          <div className="w-full md:w-2/5 bg-gradient-to-b from-blue-500 to-indigo-600 p-8 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-white">
              {/* Logo */}
              <div className="h-24 w-24 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl flex items-center justify-center mb-4">
                <Building size={48} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">BuildSafe</h1>
              <p className="text-blue-100 text-center max-w-xs">
                Gestiona tus proyectos de construcción de manera segura y eficiente
              </p>
            </div>
          </div>

          {/* Sección derecha - Formulario */}
          <div className="w-full md:w-3/5 p-8 space-y-6">
            <div className="flex flex-col items-center justify-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Iniciar Sesión
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Accede a tu cuenta para continuar
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Campo Usuario con animación y validación visual */}
                <div className="relative">
                  <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="usuario"
                      name="usuario"
                      type="text"
                      value={credentials.usuario}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      placeholder="Tu nombre de usuario"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Campo Contraseña con icono */}
                <div className="relative">
                  <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="contrasena"
                      name="contrasena"
                      type="password"
                      value={credentials.contrasena}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Recordarme y Olvidé mi contraseña */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Recordarme
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle size={20} className="text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de Submit con efecto de hover y loading */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ingresando...
                    </span>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <Lock size={20} className="text-blue-200 group-hover:text-blue-100 transition-colors" />
                      </span>
                      <span className="pl-5">Iniciar Sesión</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 rounded">O</span>
              </div>
            </div>

            {/* Botón Google */}
            <div>
              <GoogleButton onClick={handleGoogleLogin} loading={isLoading} />
            </div>

            {/* Link a registro */}
            <div className="text-center text-sm">
              <span className="text-gray-600">¿No tienes cuenta? </span>
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-5 text-center text-xs text-gray-500">
          © 2025 BuildSafe. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};