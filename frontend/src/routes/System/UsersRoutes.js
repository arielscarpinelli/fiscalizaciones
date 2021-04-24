import React from "react";
import { Switch } from "react-router-dom";

import PrivateRoute from "directives/PrivateRoute";

import ListUsers from "pages/System/Users/ListUsers";
import CreateUser from "pages/System/Users/CreateUser";

const UsersRoutes = ({ match: { path } }) => {
  return (
    <Switch>
      <PrivateRoute path={`${path}/crear`} component={CreateUser} exact />
      <PrivateRoute path={`${path}`} component={ListUsers} exact />
    </Switch>
  );
};

export default UsersRoutes;
