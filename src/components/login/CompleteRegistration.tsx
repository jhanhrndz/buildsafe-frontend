import { useState, useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useUser } from '../../hooks/features/useUser';
import { useNavigate } from 'react-router-dom';
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
        global_role: user.global_role || 'supervisor'
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
      documento: formData.documento?.trim(),
      nombres: formData.nombres?.trim(),
      apellidos: formData.apellidos?.trim(),
      telefono: formData.telefono?.trim()
    };

    const updatedUser = await updateUser(user.id_usuario, payload);
    if (updatedUser) {
      login(token, updatedUser);
      navigate('/');
    }
  };

  // Determinar si el formulario es válido
  const isFormValid = Object.values(formErrors).every(error => !error) &&
    Object.values(formData).every(value => value?.toString().trim());

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Completar Registro</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Documento */}
        <div>
          <label className="block text-sm font-medium mb-1">Documento *</label>
          <input
            type="text"
            value={formData.documento}
            onChange={(e) => handleChange('documento', e.target.value)}
            onBlur={() => handleBlur('documento')}
            className={`w-full p-2 border rounded focus:ring-2 ${
              formErrors.documento ? 'border-red-500' : 'focus:ring-blue-500'
            }`}
            required
          />
          {formErrors.documento && (
            <p className="text-red-500 text-sm mt-1">{formErrors.documento}</p>
          )}
        </div>

        {/* Nombres */}
        <div>
          <label className="block text-sm font-medium mb-1">Nombres *</label>
          <input
            type="text"
            value={formData.nombres}
            onChange={(e) => handleChange('nombres', e.target.value)}
            onBlur={() => handleBlur('nombres')}
            className={`w-full p-2 border rounded focus:ring-2 ${
              formErrors.nombres ? 'border-red-500' : 'focus:ring-blue-500'
            }`}
            required
          />
          {formErrors.nombres && (
            <p className="text-red-500 text-sm mt-1">{formErrors.nombres}</p>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <label className="block text-sm font-medium mb-1">Apellidos *</label>
          <input
            type="text"
            value={formData.apellidos}
            onChange={(e) => handleChange('apellidos', e.target.value)}
            onBlur={() => handleBlur('apellidos')}
            className={`w-full p-2 border rounded focus:ring-2 ${
              formErrors.apellidos ? 'border-red-500' : 'focus:ring-blue-500'
            }`}
            required
          />
          {formErrors.apellidos && (
            <p className="text-red-500 text-sm mt-1">{formErrors.apellidos}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono *</label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            onBlur={() => handleBlur('telefono')}
            className={`w-full p-2 border rounded focus:ring-2 ${
              formErrors.telefono ? 'border-red-500' : 'focus:ring-blue-500'
            }`}
            required
          />
          {formErrors.telefono && (
            <p className="text-red-500 text-sm mt-1">{formErrors.telefono}</p>
          )}
        </div>

        {/* Rol */}
        <div>
          <label className="block text-sm font-medium mb-1">Rol *</label>
          <select
            value={formData.global_role}
            onChange={(e) => handleChange('global_role', e.target.value)}
            onBlur={() => handleBlur('global_role')}
            className={`w-full p-2 border rounded focus:ring-2 ${
              formErrors.global_role ? 'border-red-500' : 'focus:ring-blue-500'
            }`}
            required
          >
            <option value="supervisor">Supervisor</option>
            <option value="coordinador">Coordinador</option>
          </select>
          {formErrors.global_role && (
            <p className="text-red-500 text-sm mt-1">{formErrors.global_role}</p>
          )}
        </div>

        {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-2 px-4 rounded-md text-white transition-colors ${
            (!isFormValid || isLoading) 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Guardando...' : 'Completar Registro'}
        </button>
      </form>
    </div>
  );
};