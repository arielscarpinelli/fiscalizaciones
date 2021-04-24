import React from "react";
import { Switch } from "react-router-dom";

import PrivateRoute from "directives/PrivateRoute";

import ListPartidos from "pages/System/Partidos/ListPartidos";
import CreatePartido from "pages/System/Partidos/CreatePartido";
import ShowPartido from "pages/System/Partidos/ShowPartido";

const FiscalesRoutes = ({ match: { path } }) => {
  return (
    <Switch>
      <PrivateRoute path={`${path}/crear`} component={CreatePartido} exact />
      <PrivateRoute path={`${path}/:id`} component={ShowPartido} exact />
      <PrivateRoute path={`${path}`} component={ListPartidos} exact />
    </Switch>
  );
};

export default FiscalesRoutes;
