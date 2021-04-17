import React from "react";

const ErrorDisplay = ({ children }) => {
  return (
    <div>
      <div className="alert alert-danger">
        <h3>Ha ocurrido un error.</h3>
        {children}
      </div>
    </div>
  );
};

export default ErrorDisplay;
