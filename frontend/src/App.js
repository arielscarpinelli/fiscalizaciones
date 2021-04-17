import React from "react";
import { Route, Redirect } from "react-router-dom";

import Layout from "views/Layout";

import LoginRoutes from "routes/LoginRoutes";
import SystemRoutes from "routes/SystemRoutes";

const App = () => {
  return (
    <Layout>
      <LoginRoutes />
      <SystemRoutes />
      <Route
        exact
        path="/"
        render={() => <Redirect to="/autenticacion/iniciar-sesion" />}
      />
    </Layout>
  );
};

export default App;
