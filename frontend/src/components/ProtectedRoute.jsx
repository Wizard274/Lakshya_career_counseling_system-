// ============================================
// components/ProtectedRoute.jsx - Route Guard
// ============================================

import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authService.js";
import { getRoleDashboard } from "../utils/helpers.js";

/**
 * Wraps a route and redirects unauthorized users.
 * allowedRoles: array of roles that can access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("userToken");
  const user = authService.getStoredUser();

  // Not logged in → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
