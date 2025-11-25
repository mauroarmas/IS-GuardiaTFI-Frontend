import { Container } from "react-bootstrap";
import "../../../styles/modulos.css";
import "../../../styles/registroForm.css";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegistrarAtencion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        {/* Titulo */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h2>Registrar Atención</h2>
        </div>

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
                    rows="8"
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
