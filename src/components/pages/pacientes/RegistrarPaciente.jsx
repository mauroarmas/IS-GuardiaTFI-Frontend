import { Container } from "react-bootstrap";
import "../../../styles/modulos.css";
import "../../../styles/registroForm.css";
import { useForm } from "react-hook-form";
import { nivelesEmergencia } from "../../../helpers/nivelEmergencia";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Checkbox from "../../common/CheckBox";

function RegistrarPaciente() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [tieneObraSocial, setTieneObraSocial] = useState(false);
  const [obrasSociales, setObrasSociales] = useState([]);

  const location = useLocation();
  const cuilInicial = location.state?.cuilBuscado || "";

  useEffect(() => {
    if (cuilInicial) {
      setValue("cuil", cuilInicial);
    }
  }, [cuilInicial]);

  const urlObrasSociales = `${import.meta.env.VITE_BACKEND_URL}/obra_social`;

  const obtenerObrasSociales = async () => {
    try {
      const response = await axios.get(urlObrasSociales);
      setObrasSociales(response.data);
    } catch (error) {
      setObrasSociales([]);
    }
  };

  useEffect(() => {
    if (tieneObraSocial) {
      obtenerObrasSociales(); // ✅ solo cuando se activa
    } else {
      // Limpiar valores si se desactiva
      setValue("obSoc", "");
      setValue("numAfil", "");
      setObrasSociales([]); // opcional para limpiar el select
    }
  }, [tieneObraSocial]);

  const onSubmit = async (pacienteData) => {
    const domicilio = {
      calle: pacienteData.calle,
      numero: parseInt(pacienteData.numero, 10),
      localidad: pacienteData.localidad,
    };
    delete pacienteData.calle;
    delete pacienteData.numero;
    delete pacienteData.localidad;
    pacienteData = { ...pacienteData, domicilio };

    if (tieneObraSocial) {
      const obraSocial = {
        nombre: pacienteData.obSoc,
        numeroAfiliado: parseInt(pacienteData.numAfil, 10),
      };
      pacienteData = { ...pacienteData, obraSocial };

    }
          delete pacienteData.obSoc;
      delete pacienteData.numAfil;

    console.log(pacienteData);

    try {
      const urlPacientes = `${import.meta.env.VITE_BACKEND_URL}/pacientes`
      await axios.post(
        urlPacientes,
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
            <div>
              <h5>Datos de Persona</h5>
              <div className="form-row">
                <div className="w-50">
                  <input
                    type="text"
                    placeholder="CUIL*"
                    className="w-100"
                    {...register("cuil", {
                      required: "El CUIL es obligatorio",
                      pattern: {
                        value: /^\d{2}-\d{8}-\d{1}$/,
                        message: "El formato del CUIL no es válido",
                      },
                    })}
                  />
                  {errors.cuil ? (
                    <p className="text-danger">{errors.cuil.message}</p>
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
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message:
                          "El nombre solo puede contener letras y espacios",
                      },
                    })}
                  />
                  {errors.nombre ? (
                    <p className="text-danger">{errors.nombre.message}</p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </div>
                <div className="w-25 ps-1">
                  <input
                    type="text"
                    className="w-100"
                    placeholder="Apellido *"
                    {...register("apellido", {
                      required: "El apellido es obligatorio",
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message:
                          "El apellido solo puede contener letras y espacios",
                      },
                    })}
                  />
                  {errors.apellido ? (
                    <p className="text-danger">{errors.apellido.message}</p>
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
                    type="number"
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

              <div className="d-flex">
                <h5>Obra Social</h5>
                <Checkbox
                  checked={tieneObraSocial}
                  onChange={() => {
                    setTieneObraSocial(!tieneObraSocial);
                    if (tieneObraSocial) {
                      // Limpiar valores si se desmarca
                      setValue("obSoc", "");
                      setValue("numAfil", "");
                    }
                  }}
                />
              </div>
              <div className="form-row ">
                <div className="w-50">
                  <div>
                    <select
                      disabled={!tieneObraSocial}
                      className="form-control"
                      id="obraSocialNombre"
                      {...register("obSoc", {
                        required: tieneObraSocial
                          ? "La obra social es obligatoria"
                          : false,
                      })}
                      defaultValue=""
                    >
                      <option value="">Selecciona una Obra Social</option>
                      {obrasSociales.map((obra, index) => (
                        <option key={index} value={obra}>
                          {obra}
                        </option>
                      ))}
                    </select>
                    {errors.obSoc && (
                      <p className="text-danger">{errors.obSoc.message}</p>
                    )}
                  </div>
                </div>
                <div className="ps-3 w-50">
                  <input
                    disabled={!tieneObraSocial}
                    type="text"
                    className="w-100"
                    placeholder="Número de Afiliado"
                    {...register("numAfil", {
                      required: tieneObraSocial
                        ? "El número de afiliado es obligatorio"
                        : false,
                    })}
                  />
                  {errors.numAfil && (
                    <p className="text-danger">{errors.numAfil.message}</p>
                  )}
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
