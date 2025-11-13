import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../../styles/sideBar.css";
import { getTokenObject } from "../../helpers/functions";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const [isMini, setIsMini] = useState(true);
  const location = useLocation(); // Obtenemos la ubicación actual

  const tokenObject = getTokenObject();
  const rol = tokenObject ? tokenObject.rol : null;

  const handleMouseEnter = () => {
    setIsMini(false); // Expande el sidebar cuando el cursor está sobre él
  };

  const handleMouseLeave = () => {
    setIsMini(true); // Contrae el sidebar cuando el cursor sale del área
  };

  return (
    <>
      {rol !== "enfermero" ? null : (
        // <aside
        //   className={[
        //     isMini ? "mini" : "",
        //     location.pathname === "/login" ||
        //     location.pathname === "/signup" ||
        //     location.pathname === "/unauthorized"
        //       ? "d-none"
        //       : "",
        //   ].join(" ")}
        //   style={{ width: isMini ? "4.17rem" : "13rem" }}
        //   onMouseEnter={handleMouseEnter}
        //   onMouseLeave={handleMouseLeave}
        // >
        //   <div className="link d-flex flex-column justify-content-between min-vh-100 position-fixed">
        //     <ul className="min-vh-100 d-flex flex-column justify-content-center position-fixed">
        //       <li
        //         className={
        //           !location.pathname.includes("moduloPacientes") ? "active" : ""
        //         }
        //       >
        //         <Link to="/">
        //           <i className="bi bi-clipboard2-pulse-fill"></i>
        //           {!isMini && <label className="me-5">En espera</label>}
        //         </Link>
        //       </li>

        //       <li
        //         className={
        //           location.pathname.includes("/moduloPacientes") ? "active" : ""
        //         }
        //       >
        //         <Link to="/moduloPacientes">
        //           <i className="bi bi-people-fill"></i>
        //           {!isMini && <label className="me-5">Pacientes</label>}
        //         </Link>
        //       </li>
        //     </ul>
        //   </div>
        // </aside>
        <aside
          className={[
            isMini ? "mini" : "",
            location.pathname === "/login" ||
            location.pathname === "/signup" ||
            location.pathname === "/unauthorized"
              ? "d-none"
              : "",
          ].join(" ")}
          style={{ width: isMini ? "4.17rem" : "13rem" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="link d-flex flex-column justify-content-between min-vh-100 position-fixed">
            <ul className="min-vh-100 d-flex flex-column justify-content-center position-fixed">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="bi bi-clipboard2-pulse-fill"></i>
                  {!isMini && <label className="me-5">En espera</label>}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/moduloPacientes"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="bi bi-people-fill"></i>
                  {!isMini && <label className="me-5">Pacientes</label>}
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>
      )}
    </>
  );
};

export default SideBar;
