import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/features/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Building, Mail, Phone, FileText, UserCircle, Users, AlertCircle } from 'lucide-react';
import type { RegisterPayload } from '../../types/entities';

export const Register = () => {
  const navigate = useNavigate();
  const { registerLocal, isLoading, error, clearError } = useAuth();
  const [userData, setUserData] = useState<RegisterPayload>({
    usuario: '',
    contrasena: '',
    documento: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    global_role: 'supervisor'
  });

  useEffect(() => {
    return () => {
      if (clearError) clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await registerLocal(userData);
    if (success) navigate('/');
  };

  const handleChange = (field: keyof RegisterPayload, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error && clearError) clearError();
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
                Crea tu cuenta y comienza a gestionar tus proyectos de construcción de manera segura
              </p>
            </div>
          </div>

          {/* Sección derecha - Formulario */}
          <div className="w-full md:w-3/5 p-8 space-y-4 overflow-y-auto max-h-[700px]">
            <div className="flex flex-col items-center justify-center mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Registro de Usuario
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Completa tus datos para crear una cuenta
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Usuario */}
                <div className="relative col-span-1 md:col-span-2">
                  <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="usuario"
                      type="text"
                      value={userData.usuario}
                      onChange={(e) => handleChange('usuario', e.target.value)}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      placeholder="Nombre de usuario"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="relative col-span-1 md:col-span-2">
                  <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="contrasena"
                      type="password"
                      value={userData.contrasena}
                      onChange={(e) => handleChange('contrasena', e.target.value)}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                {/* Documento */}
                <div className="relative">
                  <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
                    Documento
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="documento"
                      type="text"
                      value={userData.documento}
                      onChange={(e) => handleChange('documento', e.target.value)}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      placeholder="Número de documento"
                    />
                  </div>
                </div>

                {/* Correo */}
                <div className="relative">
                  <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="correo"
                      type="email"
                      value={userData.correo}
                      onChange={(e) => handleChange('correo', e.target.value)}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      placeholder="ejemplo@correo.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Nombres */}
                <div className="relative">
                  <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="nombres"
                      type="text"
                      value={userData.nombres}
                      onChange={(e) => handleChange('nombres', e.target.value)}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      placeholder="Tus nombres"
                    />
                  </div>
                </div>

                {/* Apellidos */}
                <div className="relative">
                  <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="apellidos"
                      type="text"
                      value={userData.apellidos}
                      onChange={(e) => handleChange('apellidos', e.target.value)}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      placeholder="Tus apellidos"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div className="relative">
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="telefono"
                      type="tel"
                      value={userData.telefono}
                      onChange={(e) => handleChange('telefono', e.target.value)}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      placeholder="Número de teléfono"
                    />
                  </div>
                </div>

                {/* Rol */}
                <div className="relative">
                  <label htmlFor="global_role" className="block text-sm font-medium text-gray-700 mb-1">
                    Rol *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={20} className="text-gray-400" />
                    </div>
                    <select
                      id="global_role"
                      value={userData.global_role}
                      onChange={(e) => handleChange('global_role', e.target.value)}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 appearance-none"
                    >
                      <option value="supervisor">Supervisor</option>
                      <option value="coordinador">Coordinador</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
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
              <div className="mt-6">
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
                      Registrando...
                    </span>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <UserCircle size={20} className="text-blue-200 group-hover:text-blue-100 transition-colors" />
                      </span>
                      <span className="pl-5">Crear Cuenta</span>
                    </>
                  )}
                </button>
              </div>

              {/* Link a login */}
              <div className="text-center text-sm mt-4">
                <span className="text-gray-600">¿Ya tienes cuenta? </span>
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Inicia sesión aquí
                </Link>
              </div>
            </form>
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