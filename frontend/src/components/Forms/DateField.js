import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

const DateField = ({ name, label, readOnly, ...rest }) => {
  const { register, errors } = useFormContext();

  const error = errors[name] ? errors[name].message : null;

  return (
    <>
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input
          type="date"
          className={`form-control ${error ? "is-invalid" : ""}`}
          id={name}
          name={name}
          ref={register}
          readOnly={readOnly}
          {...rest}
        />
        {error && <small className="text-danger">{error}</small>}
      </div>
    </>
  );
};

DateField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
};

DateField.defaultProps = {
  readOnly: false,
};

export default DateField;
