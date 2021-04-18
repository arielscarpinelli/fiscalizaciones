import React from "react";
import PropTypes from "prop-types";

const FiscalBasicPresentation = ({ fiscal }) => {
  return (
    <div className="d-flex align-items-center">
      {fiscal.last_name.toUpperCase()}, {fiscal.first_name}
    </div>
  );
};

FiscalBasicPresentation.propTypes = {
  fiscal: PropTypes.object.isRequired,
};

export default FiscalBasicPresentation;
