import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "directives/PrivateRoute";

import Home from "pages/System/Home";
import CandidatesRoutes from "routes/System/CandidatesRoutes";
import PositionsRoutes from "routes/System/PositionsRoutes";
import VotingsRoutes from "routes/System/VotingsRoutes";
import UsersRoutes from "routes/System/UsersRoutes";

const SystemRoutes = () => {
  return (
    <Route
      path="/sistema"
      render={({ match: { path } }) => {
        return (
          <Switch>
            <PrivateRoute
              path={`${path}/candidatos`}
              component={CandidatesRoutes}
            />
            <PrivateRoute
              path={`${path}/posiciones`}
              component={PositionsRoutes}
            />
            <PrivateRoute
              path={`${path}/votaciones`}
              component={VotingsRoutes}
            />
            <PrivateRoute
              path={`${path}/usuarios`}
              component={UsersRoutes}
            />
            <PrivateRoute path={`${path}`} component={Home} exact />
          </Switch>
        );
      }}
    />
  );
};

export default SystemRoutes;
