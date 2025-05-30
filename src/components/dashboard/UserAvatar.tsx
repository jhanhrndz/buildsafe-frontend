import { useState } from 'react';
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

  const handleImageError = () => {
    setImageError(true);
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
          src={userPicture}
          alt={`Foto de perfil de ${userName}`}
          className="w-full h-full object-cover rounded-full"
          onError={handleImageError}
          loading="lazy"
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