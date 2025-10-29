import React from "react";
import logo from "../../assets/logo.png";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = localStorage.getItem("usuario");

  const handleLogout = () => {
    Swal.fire({
      title: "¿Deseas cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("usuario"); // Elimina el usuario de localStorage
        navigate("/login"); // Redirige al login
      }
    });
  };

  return (
    <>
      <div
        className={
          location.pathname === "/login" || location.pathname === "/signup"
            ? "d-none"
            : "d-flex justify-content-between align-items-center navbar"
        }
      >
        <div className="img-fluid m-2">
          <Link to="/">
            <img src={logo} alt="logo" className="imgNavbar" />
          </Link>
        </div>

        {usuario ? (
          <div className="d-flex align-items-center flex-column ms-5">
            <i className="bi bi-person-circle " id="loginButtom"></i>
            <h6>Bienvenido {usuario}</h6>
          </div>
        ) : (
          <div></div>
        )}

        <div className="d-flex align-items-center">
          {usuario ? (
            <Link className="text-decoration-none text-dark btn">
              <div
                className="d-flex justify-content-between align-items-center me-3"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2" id="loginButtom"></i>
                <span>Cerrar Sesión</span>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="text-decoration-none text-dark btn">
              <div className="d-flex justify-content-between align-items-center me-3">
                <i className="bi bi-door-open me-2" id="loginButtom"></i>
                <span>Iniciar Sesión</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      <Outlet></Outlet>
    </>
  );
};

export default NavBar;
