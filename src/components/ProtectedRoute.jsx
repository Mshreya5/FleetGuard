import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'Admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'Fleet Manager':
        return <Navigate to="/fleetmanager/dashboard" replace />;
      case 'Driver':
        return <Navigate to="/driver/dashboard" replace />;
      case 'Service Center':
        return <Navigate to="/servicecenter/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}
