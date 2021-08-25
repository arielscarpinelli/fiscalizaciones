import React from "react";
import { Switch } from "react-router-dom";

import PrivateRoute from "directives/PrivateRoute";

import ListActas from "pages/System/Actas/ListActas";
import ShowActa from "pages/System/Actas/ShowActa";
import CreateActa from "pages/System/Actas/CreateActa";

const ActasRoutes = ({ match: { path } }) => {
  return (
    <Switch>
      {
      <PrivateRoute path={`${path}/crear`} component={CreateActa} exact />}
      <PrivateRoute path={`${path}/:id`} component={ShowActa} exact />
      <PrivateRoute path={`${path}`} component={ListActas} exact />
    </Switch>
  );
};

export default ActasRoutes;
