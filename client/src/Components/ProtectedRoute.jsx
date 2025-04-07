import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  // Show loading state while verifying authentication
  if (isLoading) {
    return <div>Loading...</div>; // You could replace this with a spinner component
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
