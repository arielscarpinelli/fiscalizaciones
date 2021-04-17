import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

const TextAreaField = ({ name, label, readOnly, ...rest }) => {
  const { register, errors } = useFormContext();

  const error = errors && errors[name] ? errors[name].message : null;

  return (
    <>
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <textarea
          className={`form-control ${error ? "is-invalid" : ""}`}
          id={name}
          name={name}
          ref={register}
          readOnly={readOnly}
          {...rest}
        ></textarea>
        {error && <small className="text-danger">{error}</small>}
      </div>
    </>
  );
};

TextAreaField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
};

TextAreaField.defaultProps = {
  readOnly: false,
};

export default TextAreaField;
