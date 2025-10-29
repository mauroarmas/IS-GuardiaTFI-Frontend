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
import React, { useEffect, useState } from "react";
import "../../../styles/modulos.css";
import axios from "axios";
import Swal from "sweetalert2";

function ModuloPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      console.log(`${import.meta.env.VITE_BACKEND_URL}/pacientes`);
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/paciente`);

      setPacientes(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;
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
              className="btn btn-primary"
              to="/moduloPacientes/registrarPaciente"
            >
              <i className="bi bi-person-plus"></i> Dar de alta un paciente
            </Link>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-responsive table-container">
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>CUIL</th>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Obra Social</th>
                <th>Domicilio</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((paciente) => (
                <tr key={paciente.id}>
                  <td>{paciente.cuil}</td>
                  <td>{paciente.apellido}</td>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.obraSocial}</td>
                  <td>{paciente.domicilio}</td>

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
