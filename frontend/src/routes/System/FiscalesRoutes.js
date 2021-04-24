import React from "react";
import { Switch } from "react-router-dom";

import PrivateRoute from "directives/PrivateRoute";

import ListFiscales from "pages/System/Fiscales/ListFiscales";
import CreateFiscal from "pages/System/Fiscales/CreateFiscal";
import ShowFiscal from "pages/System/Fiscales/ShowFiscal";

const FiscalesRoutes = ({ match: { path } }) => {
  return (
    <Switch>
      <PrivateRoute path={`${path}/crear`} component={CreateFiscal} exact />
      <PrivateRoute path={`${path}/:id`} component={ShowFiscal} exact />
      <PrivateRoute path={`${path}`} component={ListFiscales} exact />
    </Switch>
  );
};

export default FiscalesRoutes;
