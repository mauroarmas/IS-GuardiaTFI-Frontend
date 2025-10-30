import React, { useEffect, useState } from "react";
import "../../styles/login.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Login() {
  const [body, setBody] = useState({
    email: "",
    pass: "",
    rol: "medico",
  });
  const [loading, setLoading] = useState(false);

  const inputChange = (e) => {
    setBody({
      ...body,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (rol) => {
    setBody({ ...body, rol });
  };

  const iniciarSesion = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Iniciar Sesión:", body);
    axios
      .post("http://localhost:8080/api/usuario/login", body)
      .then(({ data }) => {
        if (data) {
          localStorage.setItem("usuario", JSON.stringify(data.email));
          window.location.href = "/";
        } else {
          Swal.fire({
            icon: "error",
            title: "Error en la respuesta del servidor",
            text: "Intente de nuevo más tarde",
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Usuario o contraseña inválidos",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario")) || null;
    if (usuario) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="backPrincipal d-flex flex-column justify-content-center align-items-center">
      <div>
        <img src={logo} alt="Logo" className="imgLogin mb-3" />
      </div>
      <div className="contenidoLogin shadow p-4 rounded-4 bg-white">
        <div className="w-100">
          <h3 className="text-center">Iniciar Sesión</h3>

          {/* Selector de tipo de usuario */}
          <div className="d-flex justify-content-center w-50 mt-3 ">
            <button
              type="button"
              className={`btn btn-sm ${
                body.rol === "medico" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleRoleChange("medico")}
            >
              Médico
            </button>
            <button
              type="button"
              className={`btn btn-sm ${
                body.rol === "enfermero" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleRoleChange("enfermero")}
            >
              Enfermero
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={iniciarSesion} className="border p-3 formularioLogin">
            <div className="mb-1">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                value={body.email}
                onChange={inputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="pass" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="pass"
                name="pass"
                value={body.pass}
                onChange={inputChange}
                required
              />
            </div>
            <div className="d-flex justify-content-center mt-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link to="/signup">
              <span>
                <i className="bi bi-person-circle me-1 login-icon"></i>
                ¿No tienes cuenta? Regístrate
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
