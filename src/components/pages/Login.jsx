import React, { useEffect, useState } from "react";
import "../../styles/login.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Register from "./Register";

function Login() {
  const [body, setBody] = useState({ nombreUsuario: "", pass: "" });
  const [loading, setLoading] = useState(false);

  const inputChange = (e) => {
    console.log(body);
    setBody({
      ...body,
      [e.target.name]: e.target.value,
    });
  };

  const iniciarSesion = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Iniciar Sesion: ", body);
    axios
      .post("http://localhost:8080/api/usuario/login", body)
      .then(({data}) => {
        console.log("Respuesta completa:", data);
        console.log("Usuario recibido:", data.nombreUsuario);
        if (data) {
          localStorage.setItem("usuario", JSON.stringify(data.nombreUsuario));
          window.location.href = "/";
        } else {
          Swal.fire({
            icon: "error",
            title: "Error en la respuesta del servidor",
            text: "Intente de nuevo más tarde",
          });
        }
      })
      .catch(({response}) => {
        console.error("Error al iniciar sesion: ", response);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Usuario o contraseña incorrectos",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario")) || null;
    if (usuario) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="backPrincipal d-flex flex-column justify-content-center align-items-center">
      <div className="contenidoLogin">
        <img src={logo} alt="Logo" className="imgLogin" />
        <h2 className="text-center mt-4">Iniciar Sesión</h2>
        <div className="d-flex justify-content-center mt-4 w-100">
          <form className="formularioLogin" onSubmit={iniciarSesion}>
            <div className="mb-3">
              <label htmlFor="nombreUsuario" className="form-label">
                Usuario
              </label>
              <input
                type="text"
                className="form-control"
                id="nombreUsuario"
                value={body.nombreUsuario}
                onChange={inputChange}
                name="nombreUsuario"
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
                value={body.pass}
                onChange={inputChange}
                name="pass"
                required
              />
            </div>
            <div className="d-flex justify-content-center mt-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </button>
            </div>
          </form>

          

        </div>

        <Link to="/signup" className="mt-5 text-dark btn">
            <div className="d-flex justify-content-between align-items-center me-3">
              <i className="bi bi-person-circle " id="signUpButtom"></i>
              <span className="text-primary">¿No tienes cuenta? Registrate!</span>
            </div>
          </Link>
      </div>
    </div>
  );
}

export default Login;
