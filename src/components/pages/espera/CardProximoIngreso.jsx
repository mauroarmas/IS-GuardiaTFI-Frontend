import React from "react";

const CardProximoIngreso = ({ ingreso, rol, nuevaAtencion, handleShowModal }) => {
  return (
    <div>
      <h5 className="card-title">
        {ingreso.paciente.nombre} {ingreso.paciente.apellido}
      </h5>
      <p className="card-text">{ingreso?.informe}</p>
      <div className="d-flex justify-content-between">
        {rol !== "medico" ? null : (
          <a className="login-btn" onClick={() => nuevaAtencion(ingreso)}>
            <i className="bi bi-clipboard-plus me-2"></i> Atender
          </a>
        )}
        <a className="login-btn" onClick={() => handleShowModal(ingreso)}>
          <i className="bi bi-activity me-2"></i> Ver Datos
        </a>
      </div>
    </div>
  );
};

export default CardProximoIngreso;
