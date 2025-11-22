import { Container } from "react-bootstrap";
import "../../../styles/modulos.css";
import "../../../styles/registroForm.css";
import { useForm } from "react-hook-form";
import { nivelesEmergencia } from "../../../helpers/nivelEmergencia";
import axios from "axios";
import Swal from "sweetalert2";
import { getTokenObject } from "../../../helpers/functions";

function RegistrarIngreso() {
  const endpoint = `${import.meta.env.VITE_BACKEND_URL}/ingreso`;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const idEnfermera = getTokenObject()?.idProfesional;
      const nivelEmergenciaSeleccionado = nivelesEmergencia.find(
        (nivel) => nivel.nombre === data.nivelEmergencia
      );

      const datosEnviar = {
        cuilPaciente: data.cuilPaciente,
        idEnfermera: idEnfermera,
        nivelEmergencia: nivelEmergenciaSeleccionado.id,
        informe: data.informe,
        temperatura: parseFloat(data.temperatura),
        frecuenciaCardiaca: parseInt(data.frecuenciaCardiaca, 10),
        frecuenciaRespiratoria: parseInt(data.frecuenciaRespiratoria, 10),
        presionSistolica: parseInt(data.presionSistolica, 10),
        presionDiastolica: parseInt(data.presionDiastolica, 10),
      };
      console.log("Datos a enviar", datosEnviar);
      const response = await axios.post(endpoint, datosEnviar);

      if (response && response.data) {
        Swal.fire({
          title: "Ingreso agregado",
          text: "El ingreso se agregó exitosamente.",
          icon: "success",
        });
      } else {
        console.warn("Respuesta vacía del servidor");
      }

      reset();
    } catch (error) {
      console.error("Error al agregar el ingreso:", error);

      if (error.response) {
        console.log("Error response data:", error.response.data);
        Swal.fire({
          icon: "error",
          title: "Algo salió mal!",
          text:
            "Hubo un error al agregar el ingreso: " +
            (error.response.data.message || "Error desconocido"),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Algo salió mal!",
          text: "Hubo un error desconocido al agregar el ingreso",
        });
      }
    }
  };

  return (
    <div className="backPrincipal ">
      <Container className="mt-2 contenedor">
        {/* Titulo */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h2>Registrar Ingreso</h2>
        </div>

        {/* Formulario */}
        <div className="form-container mt-2 w-100">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-100 d-flex flex-column justify-content-between"
          >
            <div>
              <h5>Datos del Paciente:</h5>
              <div className="w-25 d-flex flex-column form-row">
                <label>CUIL Paciente *:</label>
                <input
                  type="text"
                  placeholder="CUIL de Paciente*"
                  className="w-100"
                  {...register("cuilPaciente", {
                    required: "El CUIL es obligatorio",
                  })}
                />
                {errors.cuilPaciente ? (
                  <p className="text-danger">{errors.cuilPaciente.message}</p>
                ) : (
                  <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                )}
              </div>
            </div>
            <h5>Datos de Ingreso</h5>
            <div className="form-row d-flex">
              <div className="w-75">
                <div className="w-100">
                  <label>Informe Médico *:</label>
                  <textarea
                    placeholder="Informe Médico*"
                    className="w-100"
                    rows={4} // opcional, para controlar el alto
                    {...register("informe", {
                      required: "El informe es obligatorio",
                    })}
                  />

                  {errors.informe ? (
                    <p className="text-danger">{errors.informe.message}</p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </div>
              </div>
              <div className="w-25 ps-3">
                <label htmlFor="nivelEmergencia">Nivel de Emergencia *:</label>
                <div>
                  <select
                    className="form-control"
                    id="nivelEmergencia"
                    {...register("nivelEmergencia", {
                      required: "El nivel de emergencia es obligatorio",
                      validate: (value) =>
                        value !== "" ||
                        "Debe seleccionar un nivel de emergencia válido",
                    })}
                    defaultValue=""
                  >
                    <option value="">Selecciona un nivel</option>
                    {nivelesEmergencia.map((nivel) => (
                      <option key={nivel.id} value={nivel.nombre}>
                        {nivel.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.nivelEmergencia ? (
                    <p className="text-danger">
                      {errors.nivelEmergencia.message}
                    </p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="form-row gap-4">
                <div className="w-25">
                  <label>Temperatura</label>
                  <input
                    type="number"
                    placeholder="Temperatura*"
                    className="w-100"
                    {...register("temperatura", {
                      required: "La temperatura es obligatoria",
                    })}
                  />
                  {errors.temperatura ? (
                    <p className="text-danger">{errors.temperatura.message}</p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>
                <div className="w-25">
                  <label>Frecuencia Cardiaca</label>
                  <input
                    type="number"
                    placeholder="Frecuencia Cardiaca*"
                    className="w-100"
                    {...register("frecuenciaCardiaca", {
                      required: "La Frec. Cardiaca es obligatoria",
                    })}
                  />
                  {errors.frecuenciaCardiaca ? (
                    <p className="text-danger">
                      {errors.frecuenciaCardiaca.message}
                    </p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>
                <div className="w-25">
                  <label>Frecuencia Respiratoria</label>
                  <input
                    type="number"
                    placeholder="Frecuencia Respiratoria*"
                    className="w-100"
                    {...register("frecuenciaRespiratoria", {
                      required: "La Frec. Respiratoria es obligatoria",
                    })}
                  />
                  {errors.frecuenciaRespiratoria ? (
                    <p className="text-danger">
                      {errors.frecuenciaRespiratoria.message}
                    </p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>
                <div className="w-25">
                  <label>Presion Arterial</label>
                  <div className="d-flex gap-3">
                    <div>
                      <input
                        type="number"
                        placeholder="Sistólica*"
                        className="inputPresionArterial w-100"
                        {...register("presionSistolica", {
                          required: "La Presión Arterial es obligatoria",
                        })}
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Diastólica*"
                        className="inputPresionArterial w-100"
                        {...register("presionDiastolica", {
                          required: "La Presión Arterial es obligatoria",
                        })}
                      />
                    </div>
                  </div>
                  {errors.presionDiastolica || errors.presionSistolica ? (
                    <p className="text-danger">
                      {errors.presionDiastolica?.message ||
                        errors.presionSistolica?.message}
                    </p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>
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
                <button type="submit" className="login-btn">
                  Registrar Ingreso
                </button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default RegistrarIngreso;
