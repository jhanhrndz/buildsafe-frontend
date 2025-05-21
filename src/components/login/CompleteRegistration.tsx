import { useState, useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useUser } from '../../hooks/features/useUser';
import { useNavigate } from 'react-router-dom';
import { FileText, UserCircle, Users, Phone, Building, AlertCircle, Save, CheckCircle } from 'lucide-react';
import type { User } from '../../types/entities';

type FormErrors = {
  documento?: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  global_role?: string;
};

export const CompleteRegistration = () => {
  const navigate = useNavigate();
  const { user, token, login } = useUserContext();
  const { updateUser, isLoading, error } = useUser();
  const [formData, setFormData] = useState<Partial<User>>({
    documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    global_role: 'supervisor'
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormErrors>>(new Set());

  useEffect(() => {
    if (user && !isUserDataIncomplete(user)) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        documento: user.documento || '',
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        correo: user.correo,
        telefono: user.telefono || '',
        global_role: user.global_role || 'supervisor',
        id_usuario: user.id_usuario!,
        usuario: user.usuario!,
        auth_provider: user.auth_provider!,
      });
    }
  }, [user]);

  const isUserDataIncomplete = (userData: User): boolean => {
    const requiredFields: (keyof FormErrors)[] = ['documento', 'nombres', 'apellidos', 'telefono', 'global_role'];
    return requiredFields.some(field => !userData[field]?.toString().trim());
  };

  const validateField = (field: keyof FormErrors, value: string) => {
    const trimmedValue = value.trim();
    let error = '';
    
    if (!trimmedValue) {
      error = 'Este campo es requerido';
    } else if (field === 'telefono' && !/^\d+$/.test(trimmedValue)) {
      error = 'Solo se permiten números';
    } else if (field === 'documento' && !/^\d+$/.test(trimmedValue)) {
      error = 'Documento inválido';
    }
    
    return error;
  };

  const handleChange = (field: keyof FormErrors, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touchedFields.has(field)) {
      const error = validateField(field, value);
      setFormErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field, formData[field]?.toString() || '');
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    const fieldsToValidate: (keyof FormErrors)[] = ['documento', 'nombres', 'apellidos', 'telefono', 'global_role'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]?.toString() || '');
      if (error) newErrors[field] = error;
    });

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;

    const isValid = validateForm();
    if (!isValid) return;

    const payload = {
      ...formData,
      id_usuario: formData.id_usuario!,
      usuario: formData.usuario!,
      auth_provider: formData.auth_provider!,
      documento: formData.documento?.trim()!,
      nombres: formData.nombres?.trim()!,
      apellidos: formData.apellidos?.trim()!,
      telefono: formData.telefono?.trim()!,
      correo: formData.correo!,
      global_role: formData.global_role!
    };

    const updatedUser = await updateUser(user.id_usuario, payload);
    if (updatedUser) {
      login(token, payload);
      navigate('/');
    }
  };

  // Determinar si el formulario es válido
  const isFormValid = Object.values(formErrors).every(error => !error) &&
    Object.values(formData).every(value => value?.toString().trim());

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        {/* Card con efecto glassmorphism */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          {/* Sección izquierda - Logo y título */}
          <div className="w-full md:w-2/5 bg-gradient-to-b from-blue-500 to-indigo-600 p-8 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-white">
              {/* Logo */}
              <div className="h-24 w-24 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl flex items-center justify-center mb-6">
                <Building size={48} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">BuildSafe</h1>
              <div className="flex items-center justify-center mb-3 bg-white/20 rounded-full px-4 py-2">
                <CheckCircle size={20} className="text-green-300 mr-2" />
                <span className="text-white">Cuenta creada correctamente</span>
              </div>
              <p className="text-blue-100 text-center max-w-xs">
                Solo un paso más. Completa tu información personal para comenzar a utilizar la plataforma.
              </p>
            </div>
          </div>

          {/* Sección derecha - Formulario */}
          <div className="w-full md:w-3/5 p-8 space-y-6 overflow-y-auto max-h-[700px]">
            <div className="flex flex-col items-center justify-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Completar Registro
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Necesitamos algunos datos adicionales para configurar tu cuenta
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Documento */}
              <div className="relative">
                <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
                  Documento *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="documento"
                    type="text"
                    value={formData.documento}
                    onChange={(e) => handleChange('documento', e.target.value)}
                    onBlur={() => handleBlur('documento')}
                    disabled={isLoading}
                    className={`pl-10 w-full py-2.5 border rounded-lg bg-white/50 focus:ring-2 transition-all duration-200 ${
                      formErrors.documento 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-500/50 focus:border-blue-500'
                    }`}
                    placeholder="Número de documento"
                    required
                  />
                </div>
                {formErrors.documento && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {formErrors.documento}
                  </p>
                )}
              </div>

              {/* Nombres */}
              <div className="relative">
                <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombres *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="nombres"
                    type="text"
                    value={formData.nombres}
                    onChange={(e) => handleChange('nombres', e.target.value)}
                    onBlur={() => handleBlur('nombres')}
                    disabled={isLoading}
                    className={`pl-10 w-full py-2.5 border rounded-lg bg-white/50 focus:ring-2 transition-all duration-200 ${
                      formErrors.nombres 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-500/50 focus:border-blue-500'
                    }`}
                    placeholder="Tus nombres"
                    required
                  />
                </div>
                {formErrors.nombres && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {formErrors.nombres}
                  </p>
                )}
              </div>

              {/* Apellidos */}
              <div className="relative">
                <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="apellidos"
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => handleChange('apellidos', e.target.value)}
                    onBlur={() => handleBlur('apellidos')}
                    disabled={isLoading}
                    className={`pl-10 w-full py-2.5 border rounded-lg bg-white/50 focus:ring-2 transition-all duration-200 ${
                      formErrors.apellidos 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-500/50 focus:border-blue-500'
                    }`}
                    placeholder="Tus apellidos"
                    required
                  />
                </div>
                {formErrors.apellidos && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {formErrors.apellidos}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="relative">
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    onBlur={() => handleBlur('telefono')}
                    disabled={isLoading}
                    className={`pl-10 w-full py-2.5 border rounded-lg bg-white/50 focus:ring-2 transition-all duration-200 ${
                      formErrors.telefono 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-500/50 focus:border-blue-500'
                    }`}
                    placeholder="Número de teléfono"
                    required
                  />
                </div>
                {formErrors.telefono && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {formErrors.telefono}
                  </p>
                )}
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
                    value={formData.global_role}
                    onChange={(e) => handleChange('global_role', e.target.value)}
                    onBlur={() => handleBlur('global_role')}
                    disabled={isLoading}
                    className={`pl-10 w-full py-2.5 border rounded-lg bg-white/50 focus:ring-2 transition-all duration-200 appearance-none ${
                      formErrors.global_role 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-500/50 focus:border-blue-500'
                    }`}
                    required
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
                {formErrors.global_role && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {formErrors.global_role}
                  </p>
                )}
              </div>

              {/* Error general */}
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
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white transition-all duration-200 font-medium ${
                    (!isFormValid || isLoading) 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <Save size={20} className="text-blue-200 group-hover:text-blue-100 transition-colors" />
                      </span>
                      <span className="pl-5">Completar Registro</span>
                    </>
                  )}
                </button>
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