import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // No hay usuario logueado → redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos y el del usuario no está incluido → acceso denegado
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Caso contrario, renderiza la vista protegida
  return children;
};

export default ProtectedRoute;
