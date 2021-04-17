import React from "react";
import { Switch } from "react-router-dom";

import PrivateRoute from "directives/PrivateRoute";

import ShowCandidates from "pages/System/Candidates/ShowCandidates";
import CreateCandidate from "pages/System/Candidates/CreateCandidate";
import ShowCandidate from "pages/System/Candidates/ShowCandidate";

const CandidatesRoutes = ({ match: { path } }) => {
  return (
    <Switch>
      <PrivateRoute path={`${path}/crear`} component={CreateCandidate} exact />
      <PrivateRoute path={`${path}/:id`} component={ShowCandidate} exact />
      <PrivateRoute path={`${path}`} component={ShowCandidates} exact />
    </Switch>
  );
};

export default CandidatesRoutes;
