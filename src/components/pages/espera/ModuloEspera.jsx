import { Container, Table, Modal } from "react-bootstrap";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../styles/modulos.css";
import axiosClient from "../../../utils/axiosClient";
import Grafico from "../../common/Grafico";
import { getTokenObject } from "../../../helpers/functions";
import Swal from "sweetalert2";
import {
  getColorByUrgencyLevel,
  nivelesEmergencia,
} from "../../../helpers/nivelEmergencia";
import CardProximoIngreso from "./CardProximoIngreso";

function App() {
  const [incomes, setIncomes] = useState([]);
  const [chartData, setChartData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [atencionPendiente, setAtencionPendiente] = useState(null);
  const [pacientePendiente, setPacientePendiente] = useState("");
  const [loading, setLoading] = useState(true);
  const skeletonRows = Array.from({ length: 3 });
  const navigate = useNavigate();

  const rol = getTokenObject()?.rol;
  const idMedico = getTokenObject()?.idProfesional;

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/ingreso");
      setIncomes(response.data);

      armarGrafica(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // finaliza loading
    }
  };

  const handleShowModal = (income) => {
    setSelectedIncome(income);
    setModalShow(true);
  };

  const armarGrafica = (response) => {
    // Convertir id -> nombre
    const mapNiveles = Object.fromEntries(
      nivelesEmergencia.map((n) => [n.id, n.nombre])
    );

    // Resumen inicial de 0
    const resumen = Object.fromEntries(nivelesEmergencia.map((n) => [n.id, 0]));

    // Contar ingresos
    response.data.forEach((ingreso) => {
      const id = Number(ingreso.nivelEmergencia);

      if (resumen[id] !== undefined) resumen[id]++;
    });

    // Generar labels y data ordenadas por ID
    const labels = nivelesEmergencia.map((n) => n.nombre);
    const data = nivelesEmergencia.map((n) => resumen[n.id]);

    setChartData({ labels, data });
  };

  const nuevaAtencion = (income) => {
    if (atencionPendiente) {
      Swal.fire({
        title: "¿Desea continuar la atención?",
        text: "Debe finalizar su atención actual antes de iniciar una nueva.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axiosClient.get(`/atencion/${idMedico}`);
          navigate(`/registrarAtencion`, {
            state: { ingreso: response.data.ingreso },
          });
        }
      });
    } else {
      Swal.fire({
        title: "¿Desea atender a este paciente?",
        text: "Quitará al paciente de la lista de espera y no podrá cancelar la atención una vez iniciada.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Sí, atender paciente",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          navigate(`/registrarAtencion`, { state: { ingreso: income } });
          await axiosClient.get(`/ingreso/reclamar-ingreso/${idMedico}`);
        }
      });
    }
  };

  const verificarAtencionPendiente = async () => {
    try {
      const response = await axiosClient.get(`/atencion/${idMedico}`);
      if (response.status === 404) {
        console.log("No hay atencion pendiente");
        setAtencionPendiente(false);
      } else {
        console.log("Hay atencion pendiente");
        const paciente = `${response.data.ingreso.paciente.nombre} ${response.data.ingreso.paciente.apellido} (${response.data.ingreso.paciente.cuil})`;
        setPacientePendiente(paciente);
        setAtencionPendiente(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchIncomes();
    if (rol === "medico") {
      verificarAtencionPendiente();
    }
  }, []);

  return (
    <div className="backPrincipal">
      <Container>
        <div>
          <div className="d-flex align-items-center contenedorTituloGrafico ">
            {/* Titulo */}
            <div className="d-flex flex-column" style={{ width: "230px" }} id="elemento1">
              <h2>Cola de Espera</h2>
              <div className="mt-4">
                {rol !== "enfermero" ? null : (
                  <Link className="login-btn w-50 " to="/registrarIngreso" id="btnIngreso">
                    <i className="bi bi-arrow-right-square me-2"></i> Nuevo
                    Ingreso
                  </Link>
                )}
              </div>
            </div>

            {/* Gráfico */}
            <div className="contenedorGrafico">
              {incomes.length === 0 ? null : (
                <Grafico
                  arrayLabels={chartData.labels || []}
                  arrayData={chartData.data || []}
                  colores={nivelesEmergencia.map((n) => n.color)}
                  total={incomes.length}
                />
              )}
            </div>

            {/* Card */}

            {incomes.length === 0 ? (
              <div className="card">
                <div className="card-header">
                  <strong>No hay pacientes en espera</strong>
                </div>
                <div className="card-body">
                  <p>No hay pacientes en espera.</p>
                </div>
              </div>
            ) : rol === "medico" && atencionPendiente ? (
              <div className="card">
                <div className="card-header">
                  <strong>Atención en Curso</strong>
                </div>
                <div className="card-body">
                  <h5 className="card-title text-center">
                    <i className="bi bi-exclamation-triangle"></i> Tiene una
                    Atención en curso
                  </h5>
                  <p>
                    Debe finalizar la atención actual antes de iniciar una
                    nueva.
                  </p>
                  <strong>Paciente pendiente:</strong>
                  <p>{pacientePendiente}</p>
                  <a
                    className="login-btn mx-auto w-50"
                    onClick={() => nuevaAtencion()}
                  >
                    <i className="bi bi-clipboard-plus me-2"></i> Continuar
                    Atención
                  </a>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <strong>Siguiente en Espera: </strong>
                  {getColorByUrgencyLevel(incomes[0]?.nivelEmergencia)}
                </div>
                <div className="card-body">
                  <CardProximoIngreso
                    ingreso={incomes[0]}
                    rol={rol}
                    nuevaAtencion={nuevaAtencion}
                    handleShowModal={handleShowModal}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="d-flex">
            {/* Tabla */}
            <div className="table-responsive table-container w-100 " id="mbTable">
              {loading ? (
                // 👉 PRIMERO EL SKELETON
                <Table responsive striped bordered hover >
                  <thead>
                    <tr>
                      <th>Nivel de Emergencia</th>
                      <th>Paciente</th>
                      <th>Enfermera</th>
                      <th>Datos de Ingreso</th>
                      <th>Informe</th>
                    </tr>
                  </thead>

                  <tbody>
                    {skeletonRows.map((_, i) => (
                      <tr key={i}>
                        <td>
                          <div className="skeleton skeleton-text"></div>
                        </td>
                        <td>
                          <div className="skeleton skeleton-text"></div>
                        </td>
                        <td>
                          <div className="skeleton skeleton-text"></div>
                        </td>
                        <td>
                          <div className="skeleton skeleton-btn"></div>
                        </td>
                        <td>
                          <div className="skeleton skeleton-text"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : incomes.length === 0 ? (
                // 👉 SEGUNDO: MENSAJE CUANDO NO HAY DATOS
                <h4 className="text-center mt-4">
                  No hay pacientes en la cola de espera.
                </h4>
              ) : (
                // 👉 TERCERO: TABLA NORMAL
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nivel de Emergencia</th>
                      <th>Paciente</th>
                      <th>Enfermera</th>
                      <th>Datos de Ingreso</th>
                      <th>Informe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.map((ingreso, index) => (
                      <tr key={index}>
                        <td>
                          {getColorByUrgencyLevel(ingreso?.nivelEmergencia)}
                        </td>
                        <td>
                          {ingreso.paciente.nombre} {ingreso.paciente.apellido}
                        </td>
                        <td>
                          {ingreso.enfermera.nombre}{" "}
                          {ingreso.enfermera.apellido}
                        </td>
                        <td className="text-center">
                          <a
                            className="btnDatosTabla"
                            onClick={() => handleShowModal(ingreso)}
                          >
                            Ver
                          </a>
                        </td>
                        <td>{ingreso.informe}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </div>

          <ModalDatos
            show={modalShow}
            onHide={() => setModalShow(false)}
            income={selectedIncome}
          />
        </div>
      </Container>
    </div>
  );
}

function ModalDatos({ show, onHide, income }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Datos de Ingreso</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        {income ? (
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>
                  <i className="bi bi-thermometer-half"></i> Temperatura
                </td>
                <td>{income.temperatura} [°C]</td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-heart-pulse-fill"></i> Frecuencia Cardiaca
                </td>
                <td>{income.frecuenciaCardiaca.valor} [lpm]</td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-lungs-fill"></i> Frecuencia Respiratoria
                </td>
                <td>{income.frecuenciaRespiratoria.valor} [rpm]</td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-droplet-half"></i>
                  Tensión Arterial
                </td>
                <td>
                  {income.tensionArterial.sistolica.valor} /{" "}
                  {income.tensionArterial.diastolica.valor} [mmHg]
                </td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={onHide} className="w-25 mx-auto login-btn">
          Aceptar
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default App;
