import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOutsetaRouteGuard } from '../hooks/useOutsetaRouteGuard';

interface OutsetaProtectedRouteProps {
  children: React.ReactNode;
}

export const OutsetaProtectedRoute: React.FC<OutsetaProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useOutsetaRouteGuard();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-950"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};