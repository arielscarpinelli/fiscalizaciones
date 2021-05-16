import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

import Spinner from "components/Spinner";

const SelectField = ({
  name,
  label,
  options,
  readOnly,
  isLoading,
  empty,
  ...rest
}) => {
  const { register, errors } = useFormContext() || {};

  const error = errors && errors[name] ? errors[name].message : null;

  const optionsWithEmpty = empty
      ? [{
        text: empty,
        value: ""
      }, ...options]
      : options;


  return (
    <div className="form-group">
      {label ? <label htmlFor={name}>{label}</label> : null}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <select
            type="text"
            className={`form-control ${error ? "is-invalid" : ""}`}
            id={name}
            name={name}
            ref={register}
            readOnly={readOnly}
            disabled={readOnly}
            {...rest}
          >
            {optionsWithEmpty.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
          {error && <small className="text-danger">{error}</small>}
        </>
      )}
    </div>
  );
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      text: PropTypes.any,
    })
  ).isRequired,
  readOnly: PropTypes.bool,
  isLoading: PropTypes.bool,
};

SelectField.defaultProps = {
  options: [],
  readOnly: false,
  isLoading: false,
};

export default SelectField;
