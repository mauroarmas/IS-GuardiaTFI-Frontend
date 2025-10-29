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


  const onSubmit = async (data) => {
    const direccionCompleta = `${data.direc}, ${data.prov}`;
    delete data.direc;
    delete data.prov;
    const datosFormateados = { ...data, direccion: direccionCompleta };

    const clienteData = {
      cuitCliente: datosFormateados.cuitCliente,
      nombreCliente: datosFormateados.nombreCliente,
      telefonoCliente: datosFormateados.telefonoCliente,
      correoCliente: datosFormateados.correoCliente,
      direccion: datosFormateados.direccion,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/clientes",
        clienteData
      );

      Swal.fire({
        title: "Cliente agregado",
        text: "El cliente se agregó exitosamente.",
        icon: "success",
      });

      console.log("Cliente agregado exitosamente:", response.data);
      reset();
    } catch (error) {
      console.error("Error al agregar el cliente:", error);

      if (error.response) {
        console.log("Error response data:", error.response.data);
        Swal.fire({
          icon: "error",
          title: "Algo salió mal!",
          text:
            "Hubo un error al agregar el cliente: " +
            (error.response.data.message || "Error desconocido"),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Algo salió mal!",
          text: "Hubo un error desconocido al agregar el cliente",
        });
      }
    }

    console.log("Datos del formulario:", datosFormateados);
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
                    placeholder="CUIT*"
                    className="w-100"
                    {...register("cuitCliente", {
                      required: "El CUIT es obligatorio",
                      pattern: {
                        value: /^\d{11}$/,
                        message: "El formato del CUIL no es válido",
                      },
                    })}
                  />
                  {errors.cuitCliente ? (
                    <p className="text-danger">{errors.cuitCliente.message}</p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>
                <div className="w-100">
                  <input
                    type="text"
                    placeholder="Nombre completo*"
                    className="w-100"
                    {...register("nombreCliente", {
                      required: "El nombre completo es obligatorio",
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message:
                          "El nombre completo solo puede contener letras y espacios",
                      },
                    })}
                  />
                  {errors.nombreCliente ? (
                    <p className="text-danger">
                      {errors.nombreCliente.message}
                    </p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>
              </div>

              <div className="form-row"></div>
              <div className="form-row">
                <div className="w-100">
                  <input
                    type="email"
                    placeholder="Email*"
                    className="w-100"
                    {...register("correoCliente", {
                      required: "El email es obligatorio",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "El formato del email no es válido",
                      },
                    })}
                  />

                  {errors.correoCliente ? (
                    <p className="text-danger">
                      {errors.correoCliente.message}
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
                    {...register("telefonoCliente", {
                      required: "El número de teléfono es obligatorio",
                      pattern: {
                        value: /^\d{10,15}$/,
                        message: "El formato del teléfono no es válido",
                      },
                    })}
                  />

                  {errors.telefonoCliente ? (
                    <p className="text-danger">
                      {errors.telefonoCliente.message}
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
                    placeholder="Dirección*"
                    className="w-100"
                    {...register("direc", {
                      required: "La dirección es obligatoria",
                    })}
                  />
                  {errors.direc ? (
                    <p className="text-danger">{errors.direc.message}</p>
                  ) : (
                    <p>&nbsp;</p> // El espacio no rompe el flujo y mantiene el espacio visual
                  )}
                </div>

                <div className="d-flex w-50">
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
                <button type="submit">Registrar Paciente</button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default RegistrarPaciente;
