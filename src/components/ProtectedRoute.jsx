import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessDeniedPage from '../pages/AccessDeniedPage';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <AccessDeniedPage />;
  }

  return children;
};

export default ProtectedRoute;

