import { Container, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../styles/modulos.css";
import axiosClient from "../../../utils/axiosClient";

function ModuloPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const skeletonRows = Array.from({ length: 5 }); // 5 filas de placeholder

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/pacientes`);
      setPacientes(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;

  // Filtrado dinámico
  const filteredPatients = pacientes.filter(
    (paciente) =>
      paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.cuil.toString().includes(searchTerm)
  );

  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="backPrincipal ">
      <Container className="mt-2">
        {/* Titulo y Alta */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h2>Pacientes Registrados</h2>
        </div>

        {/* Busqueda  */}
        <div className="filterContainer mt-2">
          <Form.Control
            type="text"
            placeholder="Buscar por Apellido o CUIL"
            className="mb-2 search-bar"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reiniciar a la primera página al buscar
            }}
          />
          <div>
            <Link
              className="login-btn px-3"
              to="/moduloPacientes/registrarPaciente"
            >
              <i className="bi bi-person-plus me-2"></i> Dar de alta un paciente
            </Link>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-responsive table-container">
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: "10%" }}>CUIL</th>
                <th style={{ width: "25%" }}>Nombre Completo</th>
                <th style={{ width: "15%" }}>Obra Social</th>
                <th style={{ width: "30%" }}>Domicilio</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? // 5 filas de skeleton
                  skeletonRows.map((_, i) => (
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
                  ))
                : currentPatients.map((paciente) => (
                    <tr key={paciente.cuil}>
                      <td>{paciente.cuil}</td>
                      <td>
                        {paciente.apellido} {paciente.nombre}
                      </td>
                      <td>
                        {paciente.obraSocial
                          ? `${paciente.obraSocial.obraSocial?.nombre} (${paciente.obraSocial.numeroAfiliado})`
                          : "Sin Obra Social"}
                      </td>
                      <td>
                        {paciente.domicilio.calle} {paciente.domicilio.numero} -{" "}
                        {paciente.domicilio.localidad}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </Table>
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
      </Container>
    </div>
  );
}

export default ModuloPacientes;
