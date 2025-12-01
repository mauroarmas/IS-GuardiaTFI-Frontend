import { Container, Table, Modal } from "react-bootstrap";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../styles/modulos.css";
import axiosClient from "../../../utils/axiosClient";
import Grafico from "../../common/Grafico";
import { getTokenObject } from "../../../helpers/functions";
import Swal from "sweetalert2";
import { getColorByUrgencyLevel, nivelesEmergencia } from "../../../helpers/nivelEmergencia";

function App() {
  const [incomes, setIncomes] = useState([]);
  const [chartData, setChartData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const navigate = useNavigate();

  const rol = getTokenObject()?.rol;


  const fetchIncomes = async () => {
    try {
      const response = await axiosClient.get("/ingreso");
      setIncomes(response.data);

      armarGrafica(response);
    } catch (error) {
      console.error(error);
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
        await axiosClient.get("/ingreso/reclamar-ingreso");
      }
    });
  };



  useEffect(() => {
    fetchIncomes();
  }, []);

  return (
    <div className="backPrincipal">
      <Container>
        <div>
          <div className="d-flex align-items-center">
            {/* Titulo */}
            <div className="d-flex flex-column" style={{ width: "230px"}}>
              <h2>Cola de Espera</h2>
              <div className="mt-4">
                {rol !== "enfermero" ? null : (
                  <Link className="login-btn w-50 " to="/registrarIngreso">
                    <i className="bi bi-arrow-right-square me-2"></i> Nuevo
                    Ingreso
                  </Link>
                )}
              </div>
            </div>

            {/* Gráfico */}
            <div className="contenedorGrafico" >

              <Grafico
                arrayLabels={chartData.labels || []}
                arrayData={chartData.data || []}
                colores={nivelesEmergencia.map((n) => n.color)}
                total={incomes.length}
              />
            </div>

            {/* Card */}
            <div className="my-4 ms-auto card w-50">
              <div className="card-header">
                <strong>Siguiente en Espera: </strong>
                {getColorByUrgencyLevel(incomes[0]?.nivelEmergencia)}
              </div>
              <div className="card-body">
                {incomes.length === 0 ? (
                  <p>No hay pacientes en espera.</p>
                ) : (
                  <div>
                    <h5 className="card-title">
                      {incomes[0].paciente.nombre} {incomes[0].paciente.apellido}
                    </h5>
                    <p className="card-text">{incomes[0]?.informe}</p>
                    <div className="d-flex justify-content-between">
                      {rol !== "medico" ? null : (
                        <a 
                          className="login-btn"
                          onClick={() => nuevaAtencion(incomes[0])}
                        >
                          <i className="bi bi-clipboard-plus me-2"></i> Atender
                        </a>
                      )}

                      <a
                        className="login-btn"
                        onClick={() => handleShowModal(incomes[0])}
                      >
                        <i className="bi bi-activity me-2"></i> Ver Datos
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex">
            {/* Tabla */}
            <div className="table-responsive table-container w-100 ">
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>Nivel de Emergencia</th>
                    <th style={{ width: "15%" }}>Paciente</th>
                    <th style={{ width: "15%" }}>Enfermera</th>
                    <th style={{ width: "15%" }}>Datos de Ingreso</th>
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
                        {ingreso.enfermera.nombre} {ingreso.enfermera.apellido}
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
                  <i class="bi bi-thermometer-half"></i> Temperatura
                </td>
                <td>{income.temperatura} [°C]</td>
              </tr>
              <tr>
                <td>
                  <i class="bi bi-heart-pulse-fill"></i> Frecuencia Cardiaca
                </td>
                <td>{income.frecuenciaCardiaca.valor} [lpm]</td>
              </tr>
              <tr>
                <td>
                  <i class="bi bi-lungs-fill"></i> Frecuencia Respiratoria
                </td>
                <td>{income.frecuenciaRespiratoria.valor} [rpm]</td>
              </tr>
              <tr>
                <td>
                  <i class="bi bi-droplet-half"></i>
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
