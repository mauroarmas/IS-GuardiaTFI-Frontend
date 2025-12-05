import { Container } from "react-bootstrap";
import "../../../styles/modulos.css";
import "../../../styles/registroForm.css";
import { useForm } from "react-hook-form";
import { nivelesEmergencia } from "../../../helpers/nivelEmergencia";
import axiosClient from "../../../utils/axiosClient";
import Swal from "sweetalert2";
import { getTokenObject } from "../../../helpers/functions";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegistrarIngreso() {
  const endpoint = `${import.meta.env.VITE_BACKEND_URL}/ingreso`;

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const [paciente, setPaciente] = useState(null);
  const [cargandoPaciente, setCargandoPaciente] = useState(false);
  const [camposHabilitados, setCamposHabilitados] = useState(false);
  const [loading, setLoading] = useState(false);

  const buscarPaciente = async () => {
    const cuil = getValues("cuilPaciente").trim();

    console.log(cuil); // obtenemos el valor del input desde react-hook-form

    if (!cuil || cuil.length < 11) {
      Swal.fire({
        icon: "warning",
        title: "CUIL inválido",
        text: "Debe ingresar un CUIL válido para buscar.",
      });
      return;
    }

    try {
      setCargandoPaciente(true);

      const response = await axiosClient.get(`/pacientes/${cuil}`);

      setPaciente(response.data);
      console.log("Paciente encontrado:", response.data);
      setCamposHabilitados(true);
      Swal.fire({
        title: "Paciente encontrado",
        icon: "success",
        showConfirmButton: false,
        timer: 620,
      });
    } catch (error) {
      setPaciente(null);
      setCamposHabilitados(false);

      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: "question",
          title: "Paciente no encontrado",
          text: "No existe un paciente registrado con ese CUIL. ¿Desea registrar el paciente?",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "rgba(156, 156, 156, 1)",
          confirmButtonText: "Agregar Paciente",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/moduloPacientes/registrarPaciente", {
              state: { cuilBuscado: cuil }, // 👈 Aquí envías el CUIL
            });
          }
        });
      }

      if (error.response && error.response.status !== 404) {
        console.error("Error al buscar el paciente:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            "Error al buscar paciente " +
            (error.response.data.message || "Error desconocido"),
        });
        return;
      }
    } finally {
      setCargandoPaciente(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const idEnfermera = getTokenObject()?.idProfesional;
      const nivelEmergenciaSeleccionado = nivelesEmergencia.find(
        (nivel) => nivel.nombre === data.nivelEmergencia
      );

      const datosEnviar = {
        cuilPaciente: paciente.cuil,
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
      const response = await axiosClient.post("/ingreso", datosEnviar);

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
      setCamposHabilitados(false);
      setPaciente(null);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backPrincipal ">
      <Container className="mt-2 contenedor">
        {/* Titulo */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h2>Registrar Ingreso</h2>
          <Link className="cancel-btn w-auto " to="/">
            <i className="bi bi-arrow-right-square me-2"></i> Volver
          </Link>
        </div>

        {/* Formulario */}
        <div className="form-container ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-100 d-flex flex-column justify-content-between"
          >
            <div>
              <h5>Datos del Paciente:</h5>
              <div className="form-row">
                <div className="w-50 d-flex flex-column">
                  <label>CUIL Paciente *:</label>
                  <div className="d-flex align-items-center">
                    <input
                      disabled={camposHabilitados}
                      type="text"
                      placeholder="CUIL de Paciente*"
                      className="w-50"
                      {...register("cuilPaciente", {
                        required: "El CUIL es obligatorio",
                      })}
                    />

                    <button
                      disabled={camposHabilitados}
                      type="button"
                      className="btn btn-primary mx-3 w-auto"
                      onClick={buscarPaciente}
                    >
                      Buscar
                    </button>
                  </div>

                  {errors.cuilPaciente ? (
                    <p className="text-danger">{errors.cuilPaciente.message}</p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </div>

                <div className="w-50 ps-2 border rounded-2 bg-light d-flex flex-column justify-content-center p-2">
                  <label>Paciente:</label>
                  {paciente ? (
                    <ul>
                      <li>
                        {" "}
                        <strong>Nombre:</strong> {paciente.apellido},{" "}
                        {paciente.nombre}
                      </li>
                      <li>
                        <strong>CUIL:</strong> {paciente.cuil}
                      </li>
                    </ul>
                  ) : (
                    <p>No buscado aún</p>
                  )}
                </div>
              </div>
            </div>
            <hr />
            <h5>Datos de Ingreso</h5>
            <div className="form-row d-flex">
              <div className="w-75">
                <div className="w-100">
                  <label>Informe*:</label>
                  <textarea
                    disabled={!camposHabilitados}
                    placeholder="Informe de ingreso*"
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
                    disabled={!camposHabilitados}
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
                        {nivel.color} {nivel.nombre}
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
                    disabled={!camposHabilitados}
                    type="number"
                    step="any"
                    placeholder="Temperatura [°C]*"
                    className="w-100"
                    {...register("temperatura", {
                      required: "La temperatura es obligatoria",
                      min: {
                        value: 30,
                        message: "La temperatura debe ser al menos 30°C",
                      },
                      max: {
                        value: 45,
                        message: "La temperatura debe ser como máximo 45°C",
                      },
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
                    disabled={!camposHabilitados}
                    type="number"
                    step="any"
                    placeholder="Frecuencia Cardiaca [lpm]*"
                    className="w-100"
                    {...register("frecuenciaCardiaca", {
                      required: "La Frec. Cardiaca es obligatoria",
                      min: {
                        value: 30,
                        message:
                          "La frecuencia cardiaca debe ser al menos 30 [lpm]",
                      },
                      max: {
                        value: 200,
                        message:
                          "La frecuencia cardiaca debe ser como máximo 200 [lpm]",
                      },
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
                    disabled={!camposHabilitados}
                    type="number"
                    step="any"
                    placeholder="Frecuencia Respiratoria [rpm]*"
                    className="w-100"
                    {...register("frecuenciaRespiratoria", {
                      required: "La Frec. Respiratoria es obligatoria",
                      min: {
                        value: 5,
                        message:
                          "La frecuencia respiratoria debe ser al menos 10 rpm",
                      },
                      max: {
                        value: 60,
                        message:
                          "La frecuencia respiratoria debe ser como máximo 60 rpm",
                      },
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
                  <label>Presion Arterial [mmHg]</label>
                  <div className="d-flex gap-3">
                    <div>
                      <input
                        disabled={!camposHabilitados}
                        type="number"
                        step="any"
                        placeholder="Sistólica*"
                        className="inputPresionArterial w-100"
                        {...register("presionSistolica", {
                          required: "La Presión Arterial es obligatoria",
                          min: {
                            value: 50,
                            message:
                              "La presión sistólica debe ser al menos 50",
                          },
                          max: {
                            value: 250,
                            message:
                              "La presión sistólica debe ser como máximo 250",
                          },
                          validate: (value) =>
                            parseInt(value, 10) >
                              parseInt(
                                getValues("presionDiastolica") || "0",
                                10
                              ) ||
                            "La presión sistólica debe ser mayor que la diastólica",
                        })}
                      />
                    </div>
                    <div>
                      <input
                        disabled={!camposHabilitados}
                        type="number"
                        step="any"
                        placeholder="Diastólica*"
                        className="inputPresionArterial w-100"
                        {...register("presionDiastolica", {
                          required: "La Presión Arterial es obligatoria",
                          min: {
                            value: 30,
                            message:
                              "La presión diastólica debe ser al menos 30",
                          },
                          max: {
                            value: 150,
                            message:
                              "La presión diastólica debe ser como máximo 150",
                          },
                          validate: (value) =>
                            parseInt(value, 10) <
                              parseInt(
                                getValues("presionSistolica") || "0",
                                10
                              ) ||
                            "La presión diastólica debe ser menor que la sistólica",
                        })}
                      />
                    </div>
                  </div>
                  {errors.presionDiastolica || errors.presionSistolica ? (
                    <div>
                      <p className="text-danger">
                        {errors.presionSistolica?.message}
                      </p>
                      <p className="text-danger">
                        {errors.presionDiastolica?.message}
                      </p>
                    </div>
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
                <button
                  type="submit"
                  className={`login-btn 
                    ${!camposHabilitados ? "disabled" : ""} 
                    ${loading ? "loading" : ""}
                  `}
                  disabled={!camposHabilitados || loading}
                >
                  {loading ? "Cargando..." : "Registrar Ingreso"}
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
