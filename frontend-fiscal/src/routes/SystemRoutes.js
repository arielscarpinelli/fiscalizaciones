import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import ListActas from "pages/System/ListActas";
import PrivateRoute from "directives/PrivateRoute";

const SystemRoutes = () => {
  return (
    <Route
      path="/sistema"
      render={({ match: { path } }) => (
        <Switch>
          <Route
            path={`${path}`}
            render={() => <Redirect to={`${path}/actas`} />}
            exact
          />
          <PrivateRoute
            path={`${path}/actas`}
            component={ListActas}
            exact
          />
        </Switch>
      )}
    />
  );
};

export default SystemRoutes;
