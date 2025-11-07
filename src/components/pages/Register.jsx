import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../styles/login.css";
import logo from "../../assets/logo.png";
import Input from "../common/Input";

function Register() {
  const [role, setRole] = useState("medico");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const endpoint = `${import.meta.env.VITE_BACKEND_URL}/auth/register`;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(endpoint, {
        email: data.email,
        password: data.password,
        rol: role,
      });

      Swal.fire({
        title: "Registro Completo",
        text: "Usuario registrado correctamente. Inicie sesión para continuar.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then(() => navigate("/login"));
    } catch (error) {
      const message =
        error.response?.data?.message || "Error desconocido al registrarse";
      Swal.fire({
        icon: "error",
        title: "Algo salió mal!",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) navigate("/");
  }, [navigate]);

  return (
    <div className="backPrincipal d-flex justify-content-center align-items-center">
      <div className="w-50 d-flex justify-content-center">
        <img src={logo} alt="Logo" className="imgRegister" />
      </div>

      <div className="contenidoLogin shadow p-4 rounded-4 bg-white">
        <h3 className="text-center">Registro de Usuario</h3>

        {/* Selector de rol */}
        <div className="d-flex justify-content-center w-50 mt-3">
          {["medico", "enfermero"].map((r) => (
            <button
              key={r}
              type="button"
              className={`btn btn-sm ${
                role === r ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setRole(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form
          className="formularioLogin border p-3 w-100"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email */}
          <div className="mb-2">
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

          {/* Password */}
          <div className="mb-2">
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
            {errors.confirmPassword && (
              <p className="text-danger">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Confirmar password */}
          <div className="mb-3">

            <Input
              label="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              registerObject={register("confirmPassword", {
                required: "Debes confirmar la contraseña",
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-danger">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-50 rounded-2 mx-auto d-block"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
