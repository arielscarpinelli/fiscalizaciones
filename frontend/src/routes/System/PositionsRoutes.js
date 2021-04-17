import React from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "directives/PrivateRoute";

import ShowPositions from "pages/System/Positions/ShowPositions";
import ShowPosition from "pages/System/Positions/ShowPosition";
import CreatePosition from "pages/System/Positions/CreatePosition";

const PositionsRoutes = ({ match: { path } }) => {
  return (
    <Switch>
      <PrivateRoute path={`${path}/crear`} component={CreatePosition} exact />
      <PrivateRoute path={`${path}/:id`} component={ShowPosition} exact />
      <PrivateRoute path={`${path}`} component={ShowPositions} exact />
    </Switch>
  );
};

export default PositionsRoutes;
