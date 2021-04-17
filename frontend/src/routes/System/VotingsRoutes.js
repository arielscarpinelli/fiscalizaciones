import React from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "directives/PrivateRoute";

import ShowVotings from "pages/System/Votings/ShowVotings";
import ShowVoting from "pages/System/Votings/ShowVoting";
import CreateVoting from "pages/System/Votings/CreateVoting";
import ShowVotingPosition from "pages/System/VotingPositions/ShowVotingPosition";

const VotingsRoutes = ({ match: { path } }) => {
  return (
    <Switch>
      <PrivateRoute path={`${path}/crear`} component={CreateVoting} exact />
      <PrivateRoute path={`${path}/:id`} component={ShowVoting} exact />
      <PrivateRoute
        path={`${path}/:id/posiciones/:votingPositionId`}
        component={ShowVotingPosition}
        exact
      />
      <PrivateRoute path={`${path}`} component={ShowVotings} exact />
    </Switch>
  );
};

export default VotingsRoutes;
