import React from "react";
import PropTypes from "prop-types";

import {distritos} from "utils/geo"
import SelectField from "components/Forms/SelectField";

const SelectDistritoField = ({ name, label, readOnly, empty, ...rest }) => {

  const options = empty
      ? [{
        text: empty,
        value: ""
      }, ...distritos]
      : distritos;

  return (
    <SelectField
      name={name}
      label={label}
      readOnly={readOnly}
      options={options}
      {...rest}
    />
  );
};

SelectDistritoField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
};

SelectDistritoField.defaultProps = {
  name: "distrito",
  label: "Provincia / Distrito electoral",
  readOnly: false,
};

export default SelectDistritoField;
