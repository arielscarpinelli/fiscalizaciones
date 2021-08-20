import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

const HiddenField = ({ name, ...rest }) => {
  const { register } = useFormContext();

  return (
        <input
          type="hidden"
          name={name}
          ref={register}
          {...rest}
        />
  );
};

HiddenField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default HiddenField;
