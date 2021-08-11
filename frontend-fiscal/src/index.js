import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch} from "react-router-dom";
import moment from "moment";
import "moment/locale/es";

import {UserProvider} from "context/UserContext";

import App from "./App";
import "assets/scss/styles.scss";

moment.locale("es");

ReactDOM.render(
  <React.StrictMode>

    <UserProvider>
      <BrowserRouter>
        <Switch>
          <App/>
        </Switch>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
