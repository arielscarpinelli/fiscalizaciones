import React from "react";
import PropTypes from "prop-types";

import { getCandidatePhoto } from "api/modules/candidates.api";

const CandidateBasicPresentation = ({ candidate }) => {
  return (
    <div className="d-flex align-items-center">
      <img
        src={getCandidatePhoto(candidate.id)}
        alt={`${candidate.first_name} ${candidate.last_name}`}
        className="avatar-sm mr-2"
      />
      {candidate.last_name.toUpperCase()}, {candidate.first_name}
    </div>
  );
};

CandidateBasicPresentation.propTypes = {
  candidate: PropTypes.object.isRequired,
};

export default CandidateBasicPresentation;
