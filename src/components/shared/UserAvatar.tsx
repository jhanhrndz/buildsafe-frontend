import { useState, useEffect } from 'react';
import { UserIcon } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';

interface UserAvatarProps {
  className?: string;
}

const UserAvatar = ({ className = '' }: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const { user } = useUserContext();

  const userPicture = user?.picture || '';
  const userName = user?.nombres || user?.usuario || 'Usuario';
  const userInitials = userName.charAt(0).toUpperCase();

  useEffect(() => {
    setImageError(false);
  }, [userPicture]);

  const handleImageError = () => {
    setImageError(true);
  };

  // Función para procesar URLs de Google
  const processGoogleUrl = (url: string) => {
    if(url.includes('googleusercontent')) {
      // Elimina parámetros de tamaño que pueden causar problemas
      return url.split('=')[0] + '=s400-c'; // Tamaño fijo 400px
    }
    return url;
  };

  return (
    <div 
      className={`
        relative h-10 w-10 rounded-full 
        bg-gradient-to-br from-blue-500 to-indigo-600
        p-0.5 shadow-lg hover:shadow-xl hover:scale-105
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      {userPicture && !imageError ? (
        <img
          src={processGoogleUrl(userPicture)}
          alt={`Foto de perfil de ${userName}`}
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
          onError={handleImageError}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          {userInitials || <UserIcon size={18} className="text-white" />}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;