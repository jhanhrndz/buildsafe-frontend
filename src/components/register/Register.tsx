import { useState } from 'react';
import { useAuth } from '../../hooks/features/useAuth';
import { Link } from 'react-router-dom';
import type { RegisterPayload } from '../../types/entities';

export const RegisterForm = () => {
  const { registerLocal, isLoading, error } = useAuth();
  const [userData, setUserData] = useState<RegisterPayload>({
    usuario: '',
    contrasena: '',
    documento: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    global_role: 'supervisor' // Valor inicial válido
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerLocal(userData);
  };

  const handleChange = (field: keyof RegisterPayload, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: field === 'global_role' ? value as 'supervisor' | 'coordinador' : value
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              value={userData.usuario}
              onChange={(e) => handleChange('usuario', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={userData.contrasena}
              onChange={(e) => handleChange('contrasena', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Documento</label>
            <input
              type="text"
              value={userData.documento}
              onChange={(e) => handleChange('documento', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombres</label>
            <input
              type="text"
              value={userData.nombres}
              onChange={(e) => handleChange('nombres', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input
              type="text"
              value={userData.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              value={userData.correo}
              onChange={(e) => handleChange('correo', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              value={userData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              value={userData.global_role}
              onChange={(e) => handleChange('global_role', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="supervisor">Supervisor</option>
              <option value="coordinador">Coordinador</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? 'Registrando...' : 'Crear Cuenta'}
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-600">¿Ya tienes cuenta? </span>
          <Link to="/login" className="text-blue-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </form>
    </div>
  );
};