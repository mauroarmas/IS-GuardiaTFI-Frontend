import React, { useEffect, useState } from "react";
import "../../styles/login.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import Swal from "sweetalert2";

function Register() {
  const [body, setBody] = useState({
    nombreUsuario: "",
    pass: "",
    emailUsuario: "",
    rolUsuario: "admin",
  });
  const [confirmPass, setConfirmPass] = useState(""); // Estado para la confirmación de contraseña
  const [loading, setLoading] = useState(false);

  const inputChange = (e) => {
    setBody({
      ...body,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmPassChange = (e) => {
    setConfirmPass(e.target.value);
  };

  const iniciarSesion = (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (body.pass !== confirmPass) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden. Por favor, inténtelo de nuevo.",
      });
      return;
    }

    setLoading(true);
    axios
      .post("http://localhost:8080/api/usuario/register", body)
      .then(({ data }) => {
        if (data) {
          Swal.fire({
            title: "Registro Completo",
            text: "Usuario registrado correctamente, inicie sesión para continuar",
            icon: "success",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/login";
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error en la respuesta del servidor",
            text: "Intente de nuevo más tarde",
          });
        }
      })
      .catch(({ response }) => {
        console.error("Error al registrarse: ", response);
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
        <h2 className="text-center mt-4">Registrarse</h2>
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
              <label htmlFor="emailUsuario" className="form-label">
                Correo Electrónico:
              </label>
              <input
                type="email"
                className="form-control"
                id="emailUsuario"
                value={body.emailUsuario}
                onChange={inputChange}
                name="emailUsuario"
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

            <div className="mb-3">
              <label htmlFor="confirmPass" className="form-label">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPass"
                value={confirmPass}
                onChange={handleConfirmPassChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="rolUsuario" className="form-label">
                Rol:
              </label>

              <select
                className="form-select"
                value={body.rolUsuario}
                onChange={inputChange}
                name="rolUsuario"
              >
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
            </div>

            <div className="d-flex justify-content-center mt-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Registrarse"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
