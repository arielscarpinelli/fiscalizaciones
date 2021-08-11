import UserContext from "context/UserContext";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import useOuterClick from "utils/useOuterClick";

const Navbar = () => {
  const { logout, isLogged } = useContext(UserContext);
  const [displayMenu, setDisplayMenu] = useState(false);

  const toggleDisplayMenu = () => {
    setDisplayMenu(!displayMenu);
  };

  const hideDisplayMenu = () => {
    setDisplayMenu(false);
  };

  const navbarRef = useOuterClick(hideDisplayMenu);

  return (
    <header
      id="header-fixed"
      className="pb-3 py-3 container-fluid"
      ref={navbarRef}
    >
      <div className="row">
        <div className="d-flex flex-row justify-content-between col-12 align-items-center">
          <div className="logo-container col-4">
            <Link className="logo" to="/"></Link>
          </div>
          {isLogged && (
            <div className="submenu-container col-8 d-flex align-items-center justify-content-end">
              <div className="btn-group">
                <button
                  id="btn-usuario"
                  type="button"
                  className="btn-usuario btn dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded={displayMenu}
                  onClick={toggleDisplayMenu}
                >
                  <span className="icono-usuario"></span>
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
