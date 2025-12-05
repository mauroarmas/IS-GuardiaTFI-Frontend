import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getTokenObject } from "../../helpers/functions";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tokenObject = getTokenObject();
  const rol = tokenObject ? tokenObject.rol : null;

  const handleLogout = () => {
    Swal.fire({
      title: "¿Deseas cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  // Ocultar NavBar en login/signup
  if (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/unauthorized" || location.pathname === "/registrarAtencion") {
    return <Outlet />;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        {/* Logo */}
        <div className="img-fluid">
          {location.pathname === "/registrarAtencion" ? null : (
            <Link to="/">
              <img src="/logo.png" alt="logo" className="imgNavbar" />
            </Link>
          )}
        </div>

        {/* Usuario */}
        {rol ? (
          <div className="d-flex align-items-center flex-column ms-5 userIcon">
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
              <span id="cerrarSesionText">Cerrar Sesión</span>
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
