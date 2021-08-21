import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch } from "react-router-dom";

import { UserProvider } from "context/UserContext";

import App from "./App";
import "assets/scss/styles.scss";

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter basename="/admin">
        <Switch>
          <App />
        </Switch>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
