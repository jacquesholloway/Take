
import React from 'react';

interface ClientAvatarStarProps {
  className?: string;
}

const ClientAvatarStar: React.FC<ClientAvatarStarProps> = ({ 
  className = "w-full h-full"
}) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="currentColor"
    >
      <path d="M50 0 L58 12 L72 8 L76 22 L90 22 L88 36 L100 44 L92 56 L96 70 L82 74 L78 88 L64 86 L56 98 L44 92 L30 96 L26 82 L12 78 L14 64 L2 56 L10 44 L8 30 L22 26 L18 12 L32 14 Z" />
    </svg>
  );
};

export default ClientAvatarStar;
