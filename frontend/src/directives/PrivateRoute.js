import React, { useContext } from "react";

import UserContext from "context/UserContext";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isLogged } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        isLogged ? <Component {...props} /> : <Redirect to="/autenticacion/iniciar-sesion" />
      }
    />
  );
};

export default PrivateRoute;
