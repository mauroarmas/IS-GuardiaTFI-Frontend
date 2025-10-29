import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "../components/common/NavBar";
import ModuloPacientes from "../components/pages/pacientes/ModuloPacientes";
import RegistrarPaciente from "../components/pages/pacientes/RegistrarPaciente";


import ModuloEspera from "../components/pages/espera/ModuloEspera";
import Login from "../components/pages/Login";
import Register from "../components/pages/Register";
import RegistrarIngreso from "../components/pages/espera/RegistrarIngreso";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<NavBar className="navbar "></NavBar>}>
        <Route exact path="/login" element={<Login></Login>}></Route>
        <Route exact path="/signup" element={<Register></Register>}></Route>
        <Route
          exact
          path="/moduloPacientes"
          element={<ModuloPacientes></ModuloPacientes>}
        ></Route>
        <Route
          exact
          path="/moduloPacientes/registrarPaciente"
          element={<RegistrarPaciente editar={false}></RegistrarPaciente>}
        ></Route>

        <Route
          exact
          path="/"
          element={<ModuloEspera></ModuloEspera>}
        ></Route>

        <Route
          exact
          path="/registrarIngreso"
          element={<RegistrarIngreso></RegistrarIngreso>}
        ></Route>

      </Route>
    </Routes>
  );
};

export default AppRouter;
