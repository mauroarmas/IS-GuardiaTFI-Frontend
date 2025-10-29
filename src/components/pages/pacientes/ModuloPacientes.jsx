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
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/clientes");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };



  useEffect(() => {
    fetchData();
  }, []);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;

  // Filtrado dinámico
  const filteredClients = clients.filter(
    (client) =>
      client.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cuitCliente.toString().includes(searchTerm)
  );

  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

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
            placeholder="Buscar por nombre o CUIL"
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
                <th>Nombre Completo</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>

              </tr>
            </thead>
            <tbody>
              {currentClients.map((client) => (
                <tr key={client.cuitCliente}>
                  <td>{client.cuitCliente}</td>
                  <td>{client.nombreCliente}</td>
                  <td>{client.telefonoCliente}</td>
                  <td>{client.correoCliente}</td>
                  <td>{client.direccion}</td>
                  
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
