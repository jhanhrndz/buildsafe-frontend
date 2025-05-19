import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/features/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterPayload } from '../../types/entities';

export const Register = () => {
  const navigate = useNavigate();
  const { registerLocal, isLoading, error } = useAuth();
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
  };

  const [formValid, setFormValid] = useState(false);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Registro de Usuario</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium mb-1">Usuario *</label>
            <input
              type="text"
              value={userData.usuario}
              onChange={(e) => handleChange('usuario', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña *</label>
            <input
              type="password"
              value={userData.contrasena}
              onChange={(e) => handleChange('contrasena', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Documento */}
          <div>
            <label className="block text-sm font-medium mb-1">Documento</label>
            <input
              type="text"
              value={userData.documento}
              onChange={(e) => handleChange('documento', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombres</label>
            <input
              type="text"
              value={userData.nombres}
              onChange={(e) => handleChange('nombres', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm font-medium mb-1">Apellidos</label>
            <input
              type="text"
              value={userData.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium mb-1">Correo Electrónico *</label>
            <input
              type="email"
              value={userData.correo}
              onChange={(e) => handleChange('correo', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              value={userData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium mb-1">Rol *</label>
            <select
              value={userData.global_role}
              onChange={(e) => handleChange('global_role', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="supervisor">Supervisor</option>
              <option value="coordinador">Coordinador</option>
            </select>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? 'Registrando...' : 'Crear Cuenta'}
        </button>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">¿Ya tienes cuenta? </span>
          <Link 
            to="/login" 
            className="text-blue-600 hover:underline font-medium"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </form>
    </div>
  );
};