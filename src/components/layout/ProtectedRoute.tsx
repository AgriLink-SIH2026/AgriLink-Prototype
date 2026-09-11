import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { navigate } from '../../utils/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: UserRole;
  currentPath: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole,
  currentPath,
}) => {
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
    } else if (allowedRole && currentUser.role !== allowedRole) {
      navigate(`/${currentUser.role}/dashboard`);
    }
  }, [isAuthenticated, currentUser, allowedRole, currentPath]);

  // If unauthenticated, render transitioning loader
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 border-3 border-[#173522] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#171713]">Authenticating session...</p>
        <p className="text-xs text-[#777268] mt-1">Redirecting to login portal</p>
      </div>
    );
  }

  // If role does not match, don't flash forbidden UI
  if (allowedRole && currentUser.role !== allowedRole) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 border-3 border-[#D97824] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#171713]">Redirecting to your workspace...</p>
        <p className="text-xs text-[#777268] mt-1">
          Access restricted to {allowedRole} role. Redirecting to your {currentUser.role} dashboard.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

