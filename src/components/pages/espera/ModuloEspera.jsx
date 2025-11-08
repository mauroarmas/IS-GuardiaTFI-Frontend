import { Container, Table, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../styles/modulos.css";
import axios from "axios";
import Grafico from "./Grafico";

function App() {
  const [incomes, setIncomes] = useState([]);
  const [pacienteSiguiente, setPacienteSiguiente] = useState(null);
  const [chartData, setChartData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const rol = user?.rol || null;

  const fetchIncomes = async () => {
    const endpoint = `${import.meta.env.VITE_BACKEND_URL}/ingreso`;

    try {
      const response = await axios.get(endpoint);
      setIncomes(response.data);
      const endpointPacienteSiguiente = `${
        import.meta.env.VITE_BACKEND_URL
      }/paciente/${response.data[0]?.pacienteId}`;
      const responsePacienteSiguiente = await axios.get(
        endpointPacienteSiguiente
      );
      setPacienteSiguiente(responsePacienteSiguiente.data);

      // Gráfico de niveles de urgencia
      const resumen = response.data.reduce(
        (acc, ingreso) => {
          acc[ingreso.nivelEmergencia] =
            (acc[ingreso.nivelEmergencia] || 0) + 1;
          return acc;
        },
        {
          Emergencia: 0,
          Crítica: 0,
          Urgencia: 0,
          "Urgencia Menor": 0,
          "Sin Urgencia": 0,
        }
      );
      setChartData({
        labels: ["Crítica", "Emergencia", "Urgencia", "Urg. Menor", "Sin Urg."],
        data: [
          resumen["Crítica"],
          resumen["Emergencia"],
          resumen["Urgencia"],
          resumen["Urgencia Menor"],
          resumen["Sin Urgencia"],
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 👇 Modificamos esta función para recibir un ingreso
  const handleShowModal = (income) => {
    setSelectedIncome(income);
    setModalShow(true);
  };

  function getColorByUrgencyLevel(level) {
    switch (level) {
      case "Crítica":
        return (
          <span className="span-urgency">
            <i class="bi bi-circle-fill" style={{ color: "red" }}></i> {level}
          </span>
        );
      case "Emergencia":
        return (
          <span className="span-urgency">
            <i class="bi bi-circle-fill" style={{ color: "orange" }}></i>{" "}
            {level}
          </span>
        );
      case "Urgencia":
        return (
          <span className="span-urgency">
            <i class="bi bi-circle-fill" style={{ color: "yellow" }}></i>{" "}
            {level}
          </span>
        );
      case "Urgencia Menor":
        return (
          <span className="span-urgency">
            <i class="bi bi-circle-fill" style={{ color: "green" }}></i> {level}
          </span>
        );
      case "Sin Urgencia":
        return (
          <span className="span-urgency">
            <i class="bi bi-circle-fill" style={{ color: "blue" }}></i> {level}
          </span>
        );
      default:
        return <p style={{ color: "black" }}>No definido</p>;
    }
  }

  useEffect(() => {
    fetchIncomes();
  }, []);

  return (
    <div className="backPrincipal">
      <Container>
        <div>
          <div className="d-flex align-items-center">
            {/* Titulo */}
            <div className="d-flex flex-column w-25">
              <h2>Cola de Espera</h2>
              <div className="mt-4">
                {rol !== "enfermero" ? null : (
                  <Link className="login-btn" to="/registrarIngreso">
                    <i className="bi bi-person-plus"></i> Nuevo Ingreso
                  </Link>
                )}

              </div>
            </div>

            {/* Gráfico */}
            <div className="contenedorGrafico">
              <Grafico
                arrayLabels={chartData.labels || []}
                arrayData={chartData.data || []}
              />
            </div>

            <div className="card w-50">
              <div className="card-header">
                <strong>Paciente Siguiente: </strong>
                {getColorByUrgencyLevel(incomes[0]?.nivelEmergencia)}
              </div>
              <div className="card-body">
                <div>
                  <h5 className="card-title">
                    {pacienteSiguiente?.nombre} {pacienteSiguiente?.apellido}
                  </h5>
                  <p className="card-text">{incomes[0]?.informe}</p>
                  <div className="d-flex justify-content-between">
                    {rol !== "medico" ? null :(
                      <a href="#" className="login-btn">
                        Atender
                      </a>
                    )}

                    <a
                      className="login-btn"
                      onClick={() => handleShowModal(incomes[0])}
                    >
                      Ver Datos
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex">
            {/* Tabla */}
            <div className="table-responsive table-container fixed-height-table">
              <Table responsive striped bordered hover className="fixed-table">
                <thead>
                  <tr className="text-center">
                    <th style={{ width: "3%" }}>ID</th>
                    <th style={{ width: "12%" }}>Triage</th>
                    <th style={{ width: "12%" }}>Datos de Ingreso</th>
                    <th style={{ width: "60%" }}>Informe</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((ingreso) => (
                    <tr key={ingreso.id}>
                      <td>{ingreso.id}</td>
                      <td>{ingreso.nivelEmergencia}</td>
                      <td className="text-center">
                        <a
                          className="btnDatosTabla"
                          onClick={() => handleShowModal(ingreso)}
                        >
                          Ver Datos
                        </a>
                      </td>
                      <td>{ingreso.informe}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
                <td>Temperatura</td>
                <td>{income.temperatura}</td>
              </tr>
              <tr>
                <td>Frecuencia Cardiaca</td>
                <td>{income.frecuenciaCardiaca}</td>
              </tr>
              <tr>
                <td>Frecuencia Respiratoria</td>
                <td>{income.frecuenciaRespiratoria}</td>
              </tr>
              <tr>
                <td>Tensión Arterial</td>
                <td>{income.tensionArterial}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={onHide} className="mx-auto login-btn">
          Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default App;
