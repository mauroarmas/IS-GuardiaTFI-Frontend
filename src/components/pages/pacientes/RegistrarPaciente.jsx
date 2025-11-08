import { Container } from "react-bootstrap";
import "../../../styles/modulos.css";
import "../../../styles/registroForm.css";
import { useForm } from "react-hook-form";
import { provincias } from "../../../helpers/provincias";
import axios from "axios";
import Swal from "sweetalert2";

function RegistrarPaciente() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (pacienteData) => {

    try {
      const response = await axios.post(
        "http://localhost:8080/api/pacientes",
        pacienteData
      );

      Swal.fire({
        title: "Paciente agregado",
        text: "El paciente se agregó exitosamente.",
        icon: "success",
      });

      reset();
    } catch (error) {
      console.error("Error al agregar el paciente:", error);

      if (error.response) {
        console.log("Error response data:", error.response.data);
        Swal.fire({
          icon: "error",
          title: "Algo salió mal!",
          text:
            "Hubo un error al agregar el paciente: " +
            (error.response.data.message || "Error desconocido"),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Algo salió mal!",
          text: "Hubo un error desconocido al agregar el paciente",
        });
      }
    }
  };

  return (
    <div className="backPrincipal ">
      <Container className="mt-2 contenedor">
        {/* Titulo */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h2>Registrar Paciente</h2>
        </div>

        {/* Formulario */}
        <div className="form-container mt-2 w-100">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-100 d-flex flex-column justify-content-between"
          >
            <div>
              <div className="form-row">
                <div className="w-100">
                  <input
                    type="text"
                    placeholder="CUIL*"
                    className="w-100"
                    {...register("cuilPaciente", {
                      required: "El CUIL es obligatorio",
                      pattern: {
                        value: /^\d{11}$/,
                        message: "El formato del CUIL no es válido",
                      },
                    })}
                  />
                  {errors.cuilPaciente ? (
                    <p className="text-danger">{errors.cuilPaciente.message}</p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>
                <div className="w-100">
                  <input
                    type="text"
                    placeholder="Nombre *"
                    className="w-100"
                    {...register("nombrePaciente", {
                      required: "El nombre es obligatorio",
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message:
                          "El nombre solo puede contener letras y espacios",
                      },
                    })}
                  />
                  {errors.nombrePaciente ? (
                    <p className="text-danger">
                      {errors.nombrePaciente.message}
                    </p>
                  ) : (
                    <p>&nbsp;</p> 
                  )}
                </div>
                <div className="w-100">
                  <input
                    type="text"
                    placeholder="Apellido *"
                    className="w-100"
                    {...register("apellidoPaciente", {
                      required: "El apellido es obligatorio",
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message:
                          "El apellido solo puede contener letras y espacios",
                      },
                    })}
                  />
                  {errors.apellidoPaciente ? (
                    <p className="text-danger">
                      {errors.apellidoPaciente.message}
                    </p>
                  ) : (
                    <p>&nbsp;</p> 
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="w-100">
                  <input
                    type="email"
                    placeholder="Email*"
                    className="w-100"
                    {...register("correoPaciente", {
                      required: "El email es obligatorio",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "El formato del email no es válido",
                      },
                    })}
                  />

                  {errors.correoPaciente ? (
                    <p className="text-danger">
                      {errors.correoPaciente.message}
                    </p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>
                <div className="w-100">
                  <input
                    type="tel"
                    placeholder="Número de teléfono*"
                    className="w-100"
                    {...register("telefonoPaciente", {
                      required: "El número de teléfono es obligatorio",
                      pattern: {
                        value: /^\d{10,15}$/,
                        message: "El formato del teléfono no es válido",
                      },
                    })}
                  />

                  {errors.telefonoPaciente ? (
                    <p className="text-danger">
                      {errors.telefonoPaciente.message}
                    </p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="w-50">
                  <input
                    type="text"
                    placeholder="Domicilio*"
                    className="w-100"
                    {...register("domicilio", {
                      required: "El domicilio es obligatorio",
                    })}
                  />
                  {errors.domicilio ? (
                    <p className="text-danger">{errors.domicilio.message}</p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>

                {/* <div className="d-flex w-50">
                  <label htmlFor="provincia" className="mt-1 text-muted">
                    Provincia:
                  </label>
                  <div className="ms-auto w-50">
                    <select
                      className="form-control"
                      id="provincia"
                      {...register("prov", {
                        required: "La provincia es obligatoria",
                        validate: (value) =>
                          value !== "" ||
                          "Debe seleccionar una provincia válida",
                      })}
                      defaultValue=""
                    >
                      <option value="">Selecciona una provincia</option>
                      {provincias.map((provincia) => (
                        <option key={provincia} value={provincia}>
                          {provincia}
                        </option>
                      ))}
                    </select>
                    {errors.prov ? (
                      <p className="text-danger">{errors.prov.message}</p>
                    ) : (
                      <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                    )}
                  </div>
                </div> */}
              </div>
            </div>

            <div className="d-flex justify-content-between">
              {Object.keys(errors).length > 0 ? (
                <p className="note error">
                  Hay errores en el formulario. Por favor verifica los campos.
                </p>
              ) : (
                <p className="note">
                  Los campos que contienen (*) son obligatorios.
                </p>
              )}
              <div>
                <button type="submit" className="login-btn px-3">Registrar Paciente</button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default RegistrarPaciente;
