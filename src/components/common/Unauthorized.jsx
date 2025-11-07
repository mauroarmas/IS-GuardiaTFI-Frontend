import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="backPrincipal d-flex flex-column justify-content-center align-items-center">
    <h2>🚫 Acceso denegado</h2>
    <p>No tienes permisos para acceder a esta página.</p>
    <Link to="/" className="btn btn-primary mt-3">Volver al inicio</Link>
  </div>
);

export default Unauthorized;
