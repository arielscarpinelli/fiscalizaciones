import React, { useContext } from "react";
import UserContext from "context/UserContext";
import { Redirect, Route } from "react-router-dom";

const GuestRoute = ({ component: Component, ...rest }) => {
  const { isLogged } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        !isLogged ? <Component {...props} /> : <Redirect to="/sistema" />
      }
    />
  );
};

export default GuestRoute;
