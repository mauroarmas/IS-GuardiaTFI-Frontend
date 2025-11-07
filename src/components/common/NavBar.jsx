import React from "react";
import logo from "../../assets/logo.png";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Manejo seguro del localStorage (puede venir null)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const rol = user?.rol || null;

  const handleLogout = () => {
    Swal.fire({
      title: "¿Deseas cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
  };

  // Ocultar NavBar en login/signup
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return <Outlet />;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        {/* Logo */}
        <div className="img-fluid">
          <Link to="/">
            <img src={logo} alt="logo" className="imgNavbar" />
          </Link>
        </div>

        {/* Usuario */}
        {rol ? (
          <div className="d-flex align-items-center flex-column ms-5">
            <i className="bi bi-person-circle" id="loginButtom"></i>
            <h6>Bienvenido {rol}</h6>
          </div>
        ) : (
          <div></div>
        )}

        {/* Botón login/logout */}
        <div>
          {rol ? (
            <Link
              onClick={handleLogout}
              className="btn text-dark text-decoration-none d-flex align-items-center"
            >
              <i className="bi bi-box-arrow-right me-2" id="loginButtom"></i>
              <span>Cerrar Sesión</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="btn text-dark text-decoration-none d-flex align-items-center"
            >
              <i className="bi bi-door-open me-2" id="loginButtom"></i>
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default NavBar;
