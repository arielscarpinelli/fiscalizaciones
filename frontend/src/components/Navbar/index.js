import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "context/UserContext";
import useOuterClick from "utils/useOuterClick";

const Navbar = () => {
  const { logout, isLogged, userData } = useContext(UserContext);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  const toggleDisplayMenu = () => {
    setDisplayMenu(!displayMenu);
  };

  const hideDisplayMenu = () => {
    setDisplayMenu(false);
  };

  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const navbarRef = useOuterClick(hideDisplayMenu);

  return (
    <nav
      className="navbar navbar-expand-md fixed-top navbar-light bg-white"
      ref={navbarRef}
    >
      <Link className="navbar-brand logo" to="/sistema/"></Link>
      <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
        <span className="navbar-toggler-icon"></span>
      </button>
      {isLogged && (
        <div className={`collapse navbar-collapse ${showNavbar ? "show" : ""}`}>
          <ul className="nav navbar-nav ml-auto align-items-center">
            <Link className="nav-link" to="/sistema/fiscales">
              Fiscales
            </Link>
            <Link className="nav-link" to="/sistema/actas">
              Actas
            </Link>
            {userData && userData.role !== "OPERATOR" && (
              <Link className="nav-link" to="/sistema/usuarios">
                Usuarios
              </Link>
            )}
            {userData && userData.role === "SUPERADMIN" && (
            <Link className="nav-link" to="/sistema/partidos">
              Partidos
            </Link>
            )}
            <Link className="nav-link" to="/sistema/escuelas">
              Escuelas
            </Link>
            <div className="btn-group">
              <button
                id="btn-usuario"
                type="button"
                className="btn dropdown-toggle nav-link"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={displayMenu}
                onClick={toggleDisplayMenu}
              >
                {userData && userData.email ? userData.email : ""}
              </button>
              <div
                className={`dropdown-menu dropdown-menu-right ${
                  displayMenu ? "show" : ""
                }`}
              >
                <button
                  className="dropdown-item bold"
                  type="button"
                  onClick={logout}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
