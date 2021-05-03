import React from "react";
import { Switch } from "react-router-dom";

import PrivateRoute from "directives/PrivateRoute";

import ListMesas from "pages/System/Mesas/ListMesas";
import CreateMesa from "pages/System/Mesas/CreateMesa";
import ShowMesa from "pages/System/Mesas/ShowMesa";

const MesasRoutes = ({ match: { path } }) => {
  return (
    <Switch>
      <PrivateRoute path={`${path}/crear`} component={CreateMesa} exact />
      <PrivateRoute path={`${path}/:id`} component={ShowMesa} exact />
      <PrivateRoute path={`${path}`} component={ListMesas} exact />
    </Switch>
  );
};

export default MesasRoutes;
