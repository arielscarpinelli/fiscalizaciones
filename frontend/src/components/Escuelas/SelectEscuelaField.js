import React, {useContext} from "react";
import PropTypes from "prop-types";

import UserContext from "context/UserContext";
import TextField from "components/Forms/TextField";

const SelectEscuelaField = ({ name, label, readOnly, ...rest }) => {

  const { userData } = useContext(UserContext);

  // TODO aplicar filtro por distrito/seccion electoral del usuario si tiene.
  //const restrictedValues = values //.filter(p => readOnly || true);

  return (
    <TextField
      name={name}
      label={label}
      readOnly={readOnly}
      {...rest}
    />
  );
};

SelectEscuelaField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
};

SelectEscuelaField.defaultProps = {
  name: "escuela",
  label: "Escuela",
  readOnly: false,
};

export default SelectEscuelaField;
