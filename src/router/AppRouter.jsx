import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "../components/common/NavBar";
import ModuloPacientes from "../components/pages/pacientes/ModuloPacientes";
import RegistrarPaciente from "../components/pages/pacientes/RegistrarPaciente";
import ModuloEspera from "../components/pages/espera/ModuloEspera";
import Login from "../components/pages/Login";
import Register from "../components/pages/Register";
import RegistrarIngreso from "../components/pages/espera/RegistrarIngreso";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Unauthorized from "../components/common/Unauthorized";
import RegistrarAtencion from "../components/pages/atencion/RegistrarAtencion";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<NavBar className="navbar "></NavBar>}>
        {/* Rutas públicas */}
        <Route exact path="/login" element={<Login></Login>}></Route>
        <Route exact path="/signup" element={<Register></Register>}></Route>

        {/* Rutas protegidas para usuarios logueados */}
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <ModuloEspera></ModuloEspera>
            </ProtectedRoute>
          }
        ></Route>

        {/* Rutas protegidas según el rol */}
        <Route
          exact
          path="/moduloPacientes"
          element={
            <ProtectedRoute allowedRoles={["enfermero"]}>
              <ModuloPacientes></ModuloPacientes>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/moduloPacientes/registrarPaciente"
          element={
            <ProtectedRoute allowedRoles={["enfermero"]}>
              <RegistrarPaciente></RegistrarPaciente>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/registrarIngreso"
          element={
            <ProtectedRoute allowedRoles={["enfermero"]}>
              <RegistrarIngreso></RegistrarIngreso>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          exact
          path="/registrarAtencion"
          element={
            <ProtectedRoute allowedRoles={["medico"]}>
              <RegistrarAtencion></RegistrarAtencion>
            </ProtectedRoute>
          }
        ></Route>
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default AppRouter;
