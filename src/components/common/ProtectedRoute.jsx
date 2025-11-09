import { Navigate } from "react-router-dom";
import React from "react";
import { getTokenObject } from "../../helpers/functions";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const tokenObject = getTokenObject();

  // No hay usuario logueado → redirige al login
  if (!tokenObject) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos y el del usuario no está incluido → acceso denegado
  if (allowedRoles && !allowedRoles.includes(tokenObject.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Caso contrario, renderiza la vista protegida
  return children;
};

export default ProtectedRoute;
