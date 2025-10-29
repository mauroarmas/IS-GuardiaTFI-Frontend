import {
  Container,
  Table,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../styles/modulos.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import Grafico from "./Grafico";

function App() {
  const {
  } = useForm();

  const [incomes, setIncomes] = useState([]);
  const [filter, setFilter] = useState("todos");
  const [chartData, setChartData] = useState({});

  const fetchIncomes = async () => {

    const endpoint = `${import.meta.env.VITE_BACKEND_URL}/ingreso`

    try {
      const response = await axios.get(endpoint);
      setIncomes(response.data);
      console.log(response.data.map(i => i.nivelEmergencia));


      // Gráfico de niveles de urgencia
      const resumen = response.data.reduce(
        (acc, ingreso) => {
          acc[ingreso.nivelEmergencia] =
            (acc[ingreso.nivelEmergencia] || 0) + 1;
          return acc;
        },
        { Emergencia: 0, Crítica: 0, Urgencia: 0, "Urgencia Menor": 0, "Sin Urgencia": 0 }
      );
      setChartData({
        labels: ["Crítica", "Emergencia", "Urgencia", "Urgencia Menor", "Sin Urgencia"],
        data: [
          resumen["Crítica"],
          resumen["Emergencia"],
          resumen["Urgencia"],
          resumen["Urgencia Menor"],
          resumen["Sin Urgencia"],
        ],
      });
      console.log(chartData.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  return (
    <div className="backPrincipal ">
      <Container>
        <div className="mt-2 min-vw-50">
          {/* Titulo y Alta */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <h2>Cola de Espera</h2>
            <div>
              <Link
                className="btn btn-primary "
                to="/registrarIngreso"
              >
                <i className="bi bi-person-plus"></i> Nuevo Ingreso
              </Link>
            </div>
          </div>

          {/* Busqueda y Filtrado */}
          <div className="filterContainer mt-2">
            {/* Filtrar por nombre, dni o email search */}
            <DropdownButton
              id="state-dropdown"
              title={`Filtrar por estado: ${filter}`}
              className="mb-3"
              // onSelect={handleFilterChange}
            >
              <Dropdown.Item eventKey="todos">Todos</Dropdown.Item>
              <Dropdown.Item eventKey="en planificacion">
                En Planificación
              </Dropdown.Item>
              <Dropdown.Item eventKey="en curso">En curso</Dropdown.Item>
              <Dropdown.Item eventKey="terminado">Terminado</Dropdown.Item>
            </DropdownButton>
          </div>

          {/* Tabla */}
          <div className="d-flex">
            <div className="table-responsive table-container fixed-height-table">
              <Table responsive striped bordered hover className="fixed-table ">
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>ID</th>
                    <th>Nivel de Urgencia</th>
                    <th>Paciente</th>
                    <th style={{ width: "12%" }}>Informe </th>
                    <th style={{ width: "13%" }}>Estado</th>

                  </tr>
                </thead>
                <tbody>
                  {incomes.map((ingreso) => (
                    <tr key={ingreso.id} style={{ width: "5%" }}>
                      <td>{ingreso.id}</td>
                      <td>{ingreso.nivelEmergencia}</td>
                      <td>{ingreso.pacienteId}</td>
                      <td>{ingreso.informe}</td>
                      <td>{ingreso.estadoIngreso}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="w-25 mx-auto">
              <h4 className="text-center mt-3">Niveles de Urgencia</h4>
              <Grafico
                arrayLabels={chartData.labels || []}
                arrayData={chartData.data || []}
              />
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}


export default App;
