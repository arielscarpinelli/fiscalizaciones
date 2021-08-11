import React from "react";
import { Redirect, Route } from "react-router-dom";

import Layout from "views/Layout";

import SystemRoutes from "routes/SystemRoutes";
import LoginRoutes from "routes/LoginRoutes";

const App = () => {
  return (
    <Layout>
      <LoginRoutes />
      <SystemRoutes />
      <Route
        exact
        path="/"
        render={() => <Redirect to="/login/iniciar-sesion" />}
      />
    </Layout>
  );
};

export default App;
