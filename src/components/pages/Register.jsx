import React, { useEffect, useState } from "react";
import "../../styles/login.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import Swal from "sweetalert2";

function Register() {
  const [body, setBody] = useState({
    email: "",
    pass: "",
    rol: "medico",
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
    const handleRoleChange = (rol) => {
    setBody({ ...body, rol });
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
    <div className="backPrincipal d-flex flex-row justify-content-center align-items-center">
      <div className="w-50 d-flex justify-content-center">
        <img src={logo} alt="Logo" className="imgRegister" />
      </div>
      <div className="contenidoLogin shadow p-4 rounded-4 bg-white">
        <div className="w-100">
          <h3 className="text-center">Registro de Usuario</h3>
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
                  body.rol === "enfermero"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => handleRoleChange("enfermero")}
              >
                Enfermero
              </button>
            </div>
          {/* <div className="d-flex justify-content-center mt-4 w-100"> */}
            <form
              className="formularioLogin border p-3"
              onSubmit={iniciarSesion}
            >
              <div className="mb-1">
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

              <div className="mb-1">
                <label htmlFor="matricula" className="form-label">
                  Matricula:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="matricula"
                  value={body.matricula}
                  onChange={inputChange}
                  name="matricula"
                  required
                />
              </div>

              <div className="mb-1">
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

              <div className="d-flex justify-content-center mt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-50 rounded-2"
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Registrarse"}
                </button>
              </div>
            </form>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

export default Register;
