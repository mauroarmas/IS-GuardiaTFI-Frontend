import { Container, Table } from "react-bootstrap";
import "../../../styles/modulos.css";
import "../../../styles/registroForm.css";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getColorByUrgencyLevel } from "../../../helpers/nivelEmergencia";

function RegistrarAtencion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const ingreso = location.state?.ingreso || "";

  const navigate = useNavigate();

  const onSubmit = async (atencionData) => {
    try {
      Swal.fire({
        title: "Informe agregado",
        text: "El informe se agregó exitosamente.",
        icon: "success",
      }).then(() => {
        navigate(`/`);
      });
    } catch (error) {
      console.error("Error al agregar el paciente:", error);

      if (error.response) {
        console.log("Error response data:", error.response.data);
        Swal.fire({
          icon: "error",
          title: "Algo salió mal!",
          text:
            "Hubo un error al registrar la atencion: " +
            (error.response.data.message || "Error desconocido"),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Algo salió mal!",
          text: "Hubo un error desconocido al registrar la atencion",
        });
      }
    }
  };

  return (
    <div className="backPrincipal ">
      <Container className="mt-2 contenedor">
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h2>Registrar Atención</h2>
        </div>
        <div className="my-2 w-100 card">
          <div className="card-header d-flex justify-content-between">
            <span className="spanCardAtencion">
              <strong>Atención realizada por: </strong>
              {ingreso.enfermera.nombre} {ingreso.enfermera.apellido}
            </span>
            <span className="spanCardAtencion">
              <strong>
                {getColorByUrgencyLevel(ingreso?.nivelEmergencia)}
              </strong>
            </span>
          </div>
          <div className="card-body d-flex justify-content-between">
            <div className="w-100">
              <h5 className="card-title">
                {ingreso.paciente.apellido} {ingreso.paciente.nombre}
              </h5>
              <p className="card-text">
                <strong>Informe de Atención: </strong>
                {ingreso?.informe}
              </p>
              <div className="d-flex justify-content-between"></div>
            </div>
            <Table hover className="w-50 my-auto">
              <tbody> 
                <tr>
                  <td>
                    <i class="bi bi-thermometer-half"></i> Temperatura
                  </td>
                  <td>{ingreso.temperatura} [°C]</td>
                </tr>
                <tr>
                  <td>
                    <i class="bi bi-heart-pulse-fill"></i> Frecuencia Cardiaca
                  </td>
                  <td>{ingreso.frecuenciaCardiaca.valor} [lpm]</td>
                </tr>
                <tr>
                  <td>
                    <i class="bi bi-lungs-fill"></i> Frecuencia Respiratoria
                  </td>
                  <td>{ingreso.frecuenciaRespiratoria.valor} [rpm]</td>
                </tr>
                <tr>
                  <td>
                    <i class="bi bi-droplet-half"></i>
                    Tensión Arterial
                  </td>
                  <td>
                    {ingreso.tensionArterial.sistolica.valor} /{" "}
                    {ingreso.tensionArterial.diastolica.valor} [mmHg]
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        {/* Titulo */}

        {/* Formulario */}
        <div className="form-container mt-2 w-100">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-100 d-flex flex-column justify-content-between"
          >
            <div>
              <h5>Informe Médico</h5>
              <div className="form-row">
                <div className="w-100">
                  <textarea
                    rows="6"
                    placeholder="Informe*"
                    className="w-100"
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
                <button type="submit" className="login-btn px-3">
                  <i className="bi bi-person-plus me-2"></i> Registrar Atención
                </button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default RegistrarAtencion;
