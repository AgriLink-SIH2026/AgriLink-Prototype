import React from 'react';
import { UserRole } from '../../types';
import { User, Factory } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  switch (role) {
    case 'farmer':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60 ${sizeClasses}`}
        >
          <User className="w-3.5 h-3.5 text-emerald-700" />
          <span>Farmer</span>
        </span>
      );
    case 'factory':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-100 text-amber-800 border border-amber-300/60 ${sizeClasses}`}
        >
          <Factory className="w-3.5 h-3.5 text-amber-700" />
          <span>Processing Factory</span>
        </span>
      );
    default:
      return null;
  }
};
