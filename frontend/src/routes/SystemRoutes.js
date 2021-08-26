import React from "react";
import {Route, Switch} from "react-router-dom";
import PrivateRoute from "directives/PrivateRoute";

import Home from "pages/System/Home";
import FiscalesRoutes from "routes/System/FiscalesRoutes";
import UsersRoutes from "routes/System/UsersRoutes";
import PartidosRoutes from "routes/System/PartidosRoutes";
import EscuelasRoutes from "routes/System/EscuelasRoutes";
import ActasRoutes from "routes/System/ActasRoutes";

const SystemRoutes = () => {
  return (
    <Route
      path="/sistema"
      render={({match: {path}}) => {
        return (
          <Switch>
            <PrivateRoute
              path={`${path}/fiscales`}
              component={FiscalesRoutes}
            />
            <PrivateRoute
              path={`${path}/usuarios`}
              component={UsersRoutes}
            />
            <PrivateRoute
              path={`${path}/partidos`}
              component={PartidosRoutes}
            />
            <PrivateRoute
              path={`${path}/escuelas`}
              component={EscuelasRoutes}
            />
            <PrivateRoute
              path={`${path}/actas`}
              component={ActasRoutes}
            />
            <PrivateRoute path={`${path}`} component={Home} exact/>
          </Switch>
        );
      }}
    />
  );
};

export default SystemRoutes;
