import { Container } from "react-bootstrap";
import "../../../styles/modulos.css";
import "../../../styles/registroForm.css";
import { useForm } from "react-hook-form";
import { nivelesEmergencia } from "../../../helpers/nivelEmergencia";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function RegistrarPaciente() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const obrasSociales = [
    {
      id: 1,
      nombre: "OSDE",
    },
    {
      id: 2,
      nombre: "Swiss Medical",
    },
    {
      id: 3,
      nombre: "Galeno",
    },
    {
      id: 4,
      nombre: "Medifé",
    },
    {
      id: 5,
      nombre: "Otra",
    },
  ];

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
          <Link className="cancel-btn w-auto " to="/moduloPacientes">
            <i className="bi bi-arrow-right-square me-2"></i> Volver
          </Link>
        </div>

        {/* Formulario */}
        <div className="form-container mt-2 w-100">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-100 d-flex flex-column justify-content-between"
          >
            <h5>Datos de Persona</h5>
            <div>
              <div className="form-row">
                <div className="w-50">
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
                    <p>&nbsp;</p>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="w-25 pe-1">
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
                <div className="w-25 ps-1">
                  <input
                    type="text"
                    className="w-100"
                    placeholder="Apellido *"
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

              <h5>Domicilio</h5>
              <div className="form-row gap-3">
                <div className="w-50">
                  <input
                    type="text"
                    placeholder="Calle*"
                    className="w-100"
                    {...register("calle", {
                      required: "La calle es obligatoria",
                    })}
                  />
                  {errors.calle ? (
                    <p className="text-danger">{errors.calle.message}</p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Número*"
                    className="w-100"
                    {...register("numero", {
                      required: "El numero es obligatorio",
                    })}
                  />
                  {errors.numero ? (
                    <p className="text-danger">{errors.numero.message}</p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Localidad*"
                    className="w-100"
                    {...register("localidad", {
                      required: "La localidad es obligatoria",
                    })}
                  />
                  {errors.localidad ? (
                    <p className="text-danger">{errors.localidad.message}</p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </div>
              </div>

              <h5>Obra Social</h5>
              <div className="form-row ">
                <div className="w-50">
                  <div>
                    <select
                      className="form-control"
                      id="obraSocial"
                      {...register("obraSocial", {})}
                      defaultValue=""
                    >
                      <option value="">Selecciona una Obra Social</option>
                      {obrasSociales.map((obra) => (
                        <option key={obra.id} value={obra.nombre}>
                          {obra.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="ps-3 w-50">
                  <input
                    type="text"
                    className="w-100"
                    placeholder="Número de Afiliado"
                    {...register("numeroAfiliado", {})}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-5">
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
                <button type="submit" className="login-btn px-3">
                  <i className="bi bi-person-plus me-2"></i> Registrar Paciente
                </button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default RegistrarPaciente;
