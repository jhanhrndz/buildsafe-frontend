import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/features/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Building, Mail, Phone, FileText, UserCircle, Users, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { RegisterPayload } from '../../types/entities';

// Tipo para los errores de validación
type ValidationErrors = {
  [key in keyof RegisterPayload]?: string;
};

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
  
  // Estado para errores de validación
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  // Estado para campos que el usuario ha tocado
  const [touchedFields, setTouchedFields] = useState<Set<keyof RegisterPayload>>(new Set());
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => {
      if (clearError) clearError();
    };
  }, [clearError]);

  // Validar un campo individual
  const validateField = (field: keyof RegisterPayload, value: string): string => {
    const trimmedValue = value.trim();
    
    switch (field) {
      case 'usuario':
        if (!trimmedValue) return 'El nombre de usuario es obligatorio';
        if (trimmedValue.length < 3) return 'El usuario debe tener al menos 3 caracteres';
        return '';
        
      case 'contrasena':
        if (!trimmedValue) return 'La contraseña es obligatoria';
        const cumpleRequisitos = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(trimmedValue);
        if (!cumpleRequisitos) return 'La contraseña debe tener al menos 8 caracteres, un número y un carácter especial';

        return '';
        
      case 'correo':  
        if (!trimmedValue) return 'El correo electrónico es obligatorio';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedValue)) return 'Ingrese un correo electrónico válido';
        return '';
        
      case 'telefono':
        if (trimmedValue && !/^\d{7,15}$/.test(trimmedValue)) 
          return 'Ingrese un número de teléfono válido (7-15 dígitos)';
        return '';
        
      case 'documento':
        if (trimmedValue && !/^\d{5,20}$/.test(trimmedValue)) 
          return 'Ingrese un número de documento válido (5-20 dígitos)';
        return '';
        
      default:
        return '';
    }
  };

  // Verificar si el formulario es válido
  const isFormValid = (): boolean => {
    // Campos requeridos - deben estar presentes y válidos
    const requiredFields: (keyof RegisterPayload)[] = ['usuario', 'contrasena', 'correo'];
    
    // Verificar que todos los campos requeridos tienen valor
    const hasAllRequired = requiredFields.every(field => 
      userData[field]?.toString().trim()
    );
    
    // Verificar que no hay errores de validación en ningún campo con valor
    const hasNoErrors = Object.keys(userData).every(key => {
      const field = key as keyof RegisterPayload;
      const value = userData[field]?.toString() || '';
      
      // Si el campo está vacío y no es requerido, no hay error
      if (!value && !requiredFields.includes(field)) return true;
      
      // Validar el campo
      return !validateField(field, value);
    });
    
    return hasAllRequired && hasNoErrors;
  };

  const handleChange = (field: keyof RegisterPayload, value: string) => {
    // Actualizar datos
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Marcar el campo como tocado
    if (!touchedFields.has(field)) {
      setTouchedFields(prev => new Set(prev).add(field));
    }
    
    // Validar el campo y actualizar errores
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    if (error && clearError) clearError();
  };

  const handleBlur = (field: keyof RegisterPayload) => {
    // Marcar campo como tocado si aún no lo está
    if (!touchedFields.has(field)) {
      setTouchedFields(prev => new Set(prev).add(field));
    }
    
    // Validar el campo al perder el foco
    const error = validateField(field, userData[field]?.toString() || '');
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allFields = Object.keys(userData) as Array<keyof RegisterPayload>;
    setTouchedFields(new Set(allFields));
    
    // Validar todos los campos
    const newErrors: ValidationErrors = {};
    let isValid = true;
    
    allFields.forEach(field => {
      const value = userData[field]?.toString() || '';
      const error = validateField(field, value);
      
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setValidationErrors(newErrors);
    
    // Enviar formulario si es válido
    if (isValid) {
      const success = await registerLocal(userData);
      if (success) navigate('/');
    }
  };

  // Comprobar si un campo tiene error
  const hasError = (field: keyof RegisterPayload): boolean => {
    return touchedFields.has(field) && !!validationErrors[field];
  };

  // Obtener el mensaje de error para un campo
  const getErrorMessage = (field: keyof RegisterPayload): string => {
    return touchedFields.has(field) ? (validationErrors[field] || '') : '';
  };

  // Generar clase para input basado en si tiene error
  const getInputClasses = (field: keyof RegisterPayload): string => {
    const baseClasses = "pl-10 w-full py-2.5 border rounded-lg bg-white/50 focus:ring-2 transition-all duration-200";
    return hasError(field) 
      ? `${baseClasses} border-red-300 focus:ring-red-500/50 focus:border-red-500`
      : `${baseClasses} border-gray-300 focus:ring-blue-500/50 focus:border-blue-500`;
  };

  // Determinar si el botón debe estar habilitado
  const isSubmitEnabled = isFormValid() && !isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        {/* Card con efecto glassmorphism */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row-reverse border border-gray-100">
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
                      <User size={20} className={hasError('usuario') ? 'text-red-400' : 'text-gray-400'} />
                    </div>
                    <input
                      id="usuario"
                      type="text"
                      value={userData.usuario}
                      onChange={(e) => handleChange('usuario', e.target.value)}
                      onBlur={() => handleBlur('usuario')}
                      disabled={isLoading}
                      className={getInputClasses('usuario')}
                      placeholder="Nombre de usuario"
                      autoComplete="username"
                      required
                    />
                  </div>
                  {hasError('usuario') && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {getErrorMessage('usuario')}
                    </p>
                  )}
                </div>

                {/* Contraseña */}
                <div className="relative col-span-1 md:col-span-2">
                  <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className={hasError('contrasena') ? 'text-red-400' : 'text-gray-400'} />
                    </div>
                    <input
                      id="contrasena"
                      type={showPassword ? "text" : "password"}
                      value={userData.contrasena}
                      onChange={(e) => handleChange('contrasena', e.target.value)}
                      onBlur={() => handleBlur('contrasena')}
                      disabled={isLoading}
                      className={getInputClasses('contrasena')}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} aria-hidden="true" />
                        ) : (
                          <Eye size={18} aria-hidden="true" />
                        )}
                        <span className="sr-only">
                          {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        </span>
                      </button>
                    </div>
                  </div>
                  {hasError('contrasena') && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {getErrorMessage('contrasena')}
                    </p>
                  )}
                </div>

                {/* Documento */}
                <div className="relative">
                  <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
                    Documento
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={20} className={hasError('documento') ? 'text-red-400' : 'text-gray-400'} />
                    </div>
                    <input
                      id="documento"
                      type="text"
                      value={userData.documento}
                      onChange={(e) => handleChange('documento', e.target.value)}
                      onBlur={() => handleBlur('documento')}
                      disabled={isLoading}
                      className={getInputClasses('documento')}
                      placeholder="Número de documento"
                    />
                  </div>
                  {hasError('documento') && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {getErrorMessage('documento')}
                    </p>
                  )}
                </div>

                {/* Correo */}
                <div className="relative">
                  <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={20} className={hasError('correo') ? 'text-red-400' : 'text-gray-400'} />
                    </div>
                    <input
                      id="correo"
                      type="email"
                      value={userData.correo}
                      onChange={(e) => handleChange('correo', e.target.value)}
                      onBlur={() => handleBlur('correo')}
                      disabled={isLoading}
                      className={getInputClasses('correo')}
                      placeholder="ejemplo@correo.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  {hasError('correo') && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {getErrorMessage('correo')}
                    </p>
                  )}
                </div>

                {/* Nombres */}
                <div className="relative">
                  <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle size={20} className={hasError('nombres') ? 'text-red-400' : 'text-gray-400'} />
                    </div>
                    <input
                      id="nombres"
                      type="text"
                      value={userData.nombres}
                      onChange={(e) => handleChange('nombres', e.target.value)}
                      onBlur={() => handleBlur('nombres')}
                      disabled={isLoading}
                      className={getInputClasses('nombres')}
                      placeholder="Tus nombres"
                    />
                  </div>
                  {hasError('nombres') && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {getErrorMessage('nombres')}
                    </p>
                  )}
                </div>

                {/* Apellidos */}
                <div className="relative">
                  <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users size={20} className={hasError('apellidos') ? 'text-red-400' : 'text-gray-400'} />
                    </div>
                    <input
                      id="apellidos"
                      type="text"
                      value={userData.apellidos}
                      onChange={(e) => handleChange('apellidos', e.target.value)}
                      onBlur={() => handleBlur('apellidos')}
                      disabled={isLoading}
                      className={getInputClasses('apellidos')}
                      placeholder="Tus apellidos"
                    />
                  </div>
                  {hasError('apellidos') && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {getErrorMessage('apellidos')}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="relative">
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={20} className={hasError('telefono') ? 'text-red-400' : 'text-gray-400'} />
                    </div>
                    <input
                      id="telefono"
                      type="tel"
                      value={userData.telefono}
                      onChange={(e) => handleChange('telefono', e.target.value)}
                      onBlur={() => handleBlur('telefono')}
                      disabled={isLoading}
                      className={getInputClasses('telefono')}
                      placeholder="Número de teléfono"
                    />
                  </div>
                  {hasError('telefono') && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {getErrorMessage('telefono')}
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
                      value={userData.global_role}
                      onChange={(e) => handleChange('global_role', e.target.value)}
                      onBlur={() => handleBlur('global_role')}
                      disabled={isLoading}
                      className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 appearance-none"
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
                </div>
              </div>

              {/* Error del servidor */}
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
                  disabled={!isSubmitEnabled}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white transition-all duration-200 font-medium ${
                    !isSubmitEnabled
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