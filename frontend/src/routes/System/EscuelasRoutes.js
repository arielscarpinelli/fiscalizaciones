import React from "react";
import { Switch } from "react-router-dom";

import PrivateRoute from "directives/PrivateRoute";

import ListEscuelas from "pages/System/Escuelas/ListEscuelas";
import CreateEscuela from "pages/System/Escuelas/CreateEscuela";
import ShowEscuela from "pages/System/Escuelas/ShowEscuela";

const EscuelasRoutes = ({ match: { path } }) => {
  return (
    <Switch>
      <PrivateRoute path={`${path}/crear`} component={CreateEscuela} exact />
      <PrivateRoute path={`${path}/:id`} component={ShowEscuela} exact />
      <PrivateRoute path={`${path}`} component={ListEscuelas} exact />
    </Switch>
  );
};

export default EscuelasRoutes;
