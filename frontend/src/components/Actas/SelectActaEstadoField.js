import React from "react";
import PropTypes from "prop-types";

import {getSeccionesElectoralesByDistrito} from "utils/geo"
import SelectField from "components/Forms/SelectField";

const SelectActaEstadoField = ({ name, label, readOnly, distrito, ...rest }) => {

  const options = [{
    value: 'INGRESADA',
  }, {
    value: "COMPLETADA",
  }, {
    value: "VERIFICADA"
  }];

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

SelectActaEstadoField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
};

SelectActaEstadoField.defaultProps = {
  name: "estado",
  label: "Estado",
  readOnly: false,
};

export default SelectActaEstadoField;
