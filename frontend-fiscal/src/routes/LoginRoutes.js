import React from "react";
import {Route, Switch} from "react-router-dom";

import GuestRoute from "directives/GuestRoute";

import DNIStep from "pages/Login/DNIStep";
import ValidateEmailStep from "pages/Login/ValidateEmailStep";

const LoginRoutes = () => (
  <Route
    path="/login"
    render={({ match: { path } }) => (
      <Switch>
        <GuestRoute exact path={`${path}/iniciar-sesion`} component={DNIStep} />
        <GuestRoute
          exact
          path={`${path}/verificar-email`}
          component={ValidateEmailStep}
        />
      </Switch>
    )}
  />
);
export default LoginRoutes;
