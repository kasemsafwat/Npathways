import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ redirectPath = "/login", allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, isStudent, isInstructor } =
    useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // You could replace this with a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  // Check if user has required role
  const hasRequiredRole =
    allowedRoles.length === 0 || // If no roles specified, allow all authenticated users
    (allowedRoles.includes("student") && isStudent) ||
    (allowedRoles.includes("instructor") && isInstructor);

  if (!hasRequiredRole) {
    // Redirect to appropriate dashboard based on role
    if (isStudent) {
      return <Navigate to="/student/mypathway" replace />;
    }
    if (isInstructor) {
      return <Navigate to="/instructor/dashboard" replace />;
    }
    // Fallback if somehow user is authenticated but has no role
    return <Navigate to="/" replace />;
  }

  // Render the child routes if authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
