import {useState } from "react";
import "../../styles/login.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../common/Input";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const endpoint = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const datos = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };
      const response = await axios.post(endpoint, datos);
      if (!response?.data) {
        throw new Error("Respuesta vacía del servidor");
      }

      console.log("Respuesta del servidor:", response);

      const { token, message } = response.data;
      console.log("Token recibido:", token);

      if (message && !token) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message || "Credenciales incorrectas",
        });
        return;
      }
      if (token) {
        localStorage.setItem("token", token.accessToken);
        navigate("/");

        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          showConfirmButton: false,
          timer: 620,
        });
      } else {
        throw new Error("El servidor no respondió con los datos esperados");
      }
    } catch (error) {
      console.error("Error en login:", error);

      // ✅ Manejo de errores específicos de Axios / servidor
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Errores del backend (por ejemplo, 400, 401)
          const { status, data } = error.response;

          if (status === 401 || status === 400) {
            Swal.fire({
              icon: "error",
              title: "Credenciales incorrectas",
              text: data?.message || "Verifica tu email o contraseña.",
            });
          } else if (status >= 500) {
            Swal.fire({
              icon: "error",
              title: "Error del servidor",
              text: "Ocurrió un problema en el servidor. Intenta más tarde.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error desconocido",
              text: data?.message || "No se pudo iniciar sesión.",
            });
          }
        } else if (error.request) {
          // No se recibió respuesta
          Swal.fire({
            icon: "error",
            title: "Sin conexión",
            text: "No se pudo contactar con el servidor.",
          });
        } else {
          // Error al configurar la petición
          Swal.fire({
            icon: "error",
            title: "Error interno",
            text: error.message,
          });
        }
      } else {
        // Otros errores no relacionados con Axios
        Swal.fire({
          icon: "error",
          title: "Error inesperado",
          text: error.message || "Algo salió mal.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backPrincipal d-flex flex-column justify-content-center align-items-center">
      <div>
        <img src="/logo.png" alt="Logo" className="imgLogin mb-3" />
      </div>
      <div className="contenidoLogin shadow p-4 rounded-4 bg-white">
        <div className="w-100">
          <h3 className="text-center">Iniciar Sesión</h3>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className=" p-1">
            <div className="mb-1 ">
              <Input
                className="w-100"
                label="Correo Electrónico"
                type="email"
                placeholder="Ingresa tu email"
                registerObject={register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Formato de email no válido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-3">
              <Input
                label="Contraseña"
                type="password"
                placeholder="Ingresa tu contraseña"
                registerObject={register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 8,
                    message: "Debe tener al menos 8 caracteres",
                  },
                })}
              />
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
            </div>
            <div className="d-flex justify-content-center mx-auto mt-3 w-50">
              <button
                type="submit"
                className={`login-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </button>
            </div>
          </form>

          <div className="text-center mt-2">
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
