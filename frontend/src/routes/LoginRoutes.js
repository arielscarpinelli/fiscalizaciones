import React from "react";
import { Route, Switch } from "react-router-dom";

import GuestRoute from "directives/GuestRoute";

import Login from "pages/Authentication/Login";
import ActivateAccount from "pages/Authentication/ActivateAccount";

const LoginRoutes = () => (
  <Route
    path="/autenticacion"
    render={({ match: { path } }) => (
      <Switch>
        <GuestRoute exact path={`${path}/iniciar-sesion`} component={Login} />
        <GuestRoute exact path={`${path}/activar-cuenta`} component={ActivateAccount} />
      </Switch>
    )}
  />
);
export default LoginRoutes;
