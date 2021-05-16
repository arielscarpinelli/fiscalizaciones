import React from "react";
import PropTypes from "prop-types";

import {getSeccionesElectoralesByDistrito} from "utils/geo"
import SelectField from "components/Forms/SelectField";

const SelectSeccionElectoralField = ({ name, label, readOnly, distrito, ...rest }) => {

  const secciones = getSeccionesElectoralesByDistrito(distrito);

  return (
    <SelectField
      name={name}
      label={label}
      readOnly={readOnly}
      options={secciones}
      {...rest}
    />
  );
};

SelectSeccionElectoralField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  distrito: PropTypes.any
};

SelectSeccionElectoralField.defaultProps = {
  name: "seccion_electoral",
  label: "Municipio / Sección electoral",
  readOnly: false,
};

export default SelectSeccionElectoralField;
