import {
  Container,
  Table,
  DropdownButton,
  Dropdown,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../styles/modulos.css";
import Swal from "sweetalert2";
import axios from "axios";
import { formatDate } from "../../../helpers/functions";
import { useForm } from "react-hook-form";
import PruebaGrafico from "./PruebaGrafico";

function App() {
  const {
  } = useForm();

  const [proyects, setProyects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [noMembersMessage, setNoMembersMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [proyectoFactura, setProyectoFactura] = useState("");
  const [chartData, setChartData] = useState({});

  const fetchProyects = async (status) => {
    const endpoint =
      status === "todos"
        ? "http://localhost:8080/api/proyecto"
        : `http://localhost:8080/api/proyecto/${status}`;
    try {
      const response = await axios.get(endpoint);
      const proyectos =
        status === "todos" ? response.data : response.data.proyectoEStado;
      setProyects(proyectos);

      // Calcular la cantidad de proyectos por estado
      const resumen = proyectos.reduce(
        (acc, proyecto) => {
          acc[proyecto.estadoProyecto] =
            (acc[proyecto.estadoProyecto] || 0) + 1;
          return acc;
        },
        { "en planificacion": 0, "en curso": 0, terminado: 0 }
      );

      setChartData({
        labels: ["En Planificación", "En Curso", "Terminado"],
        data: [
          resumen["en planificacion"],
          resumen["en curso"],
          resumen["terminado"],
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchProyects(newFilter); // Llama al fetch con el nuevo filtro
    setCurrentPage(1); // Reinicia la paginación
  };


  useEffect(() => {
    fetchProyects(filter); // Llama al fetch inicial con el filtro actual
  }, [filter]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const proyectsPerPage = 10; // Define el número de filas por página
  const indexOfLastProyect = currentPage * proyectsPerPage;
  const indexOfFirstProyect = indexOfLastProyect - proyectsPerPage;
  const filteredProyects = proyects.filter(
    (proyect) =>
      proyect.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyect.idProyecto.toString().includes(searchTerm)
  );
  const currentProyects = filteredProyects.slice(
    indexOfFirstProyect,
    indexOfLastProyect
  );
  const totalPages = Math.ceil(filteredProyects.length / proyectsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //Fin Paginación

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
                to="/moduloEspera/registrarIngreso"
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
              onSelect={handleFilterChange}
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
                    <th>Nombre Proyecto</th>
                    <th style={{ width: "12%" }}>Fecha </th>
                    <th style={{ width: "13%" }}>Cliente</th>

                  </tr>
                </thead>
                <tbody>
                  {currentProyects.map((proyect) => (
                    <tr key={proyect.idProyecto} style={{ width: "5%" }}>
                      <td>{proyect.idProyecto}</td>
                      <td>{proyect.nombreProyecto}</td>
                      <td>{formatDate(proyect.fechaInicio)}</td>

                      <td>{proyect.cuitCliente}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="w-25 mx-auto">
              <h4 className="text-center mt-3">Niveles de Urgencia</h4>
              <PruebaGrafico
                arrayLabels={chartData.labels || []}
                arrayData={chartData.data || []}
              />
            </div>
          </div>


          {/* Paginación */}
          <nav aria-label="Paginación">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages && "disabled"
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </div>
  );
}


export default App;
