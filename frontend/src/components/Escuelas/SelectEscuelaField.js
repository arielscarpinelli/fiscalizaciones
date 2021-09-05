import React, {useState} from "react";
import PropTypes from "prop-types";

import {getSeccionElectoral} from "utils/geo";
import {getEscuela, searchEscuelas} from "api/modules/escuelas.api";
import AutocompleteField from "components/Forms/AutocompleteField";

const SelectEscuelaField = ({distrito, seccion, extraOptions = [], ...rest}) => {

    const [localError, setLocalError] = useState();

    const formatOption = escuela => {
      return {
        label: escuela.codigo + " - " + escuela.nombre + " - " + getSeccionElectoral(escuela.distrito, escuela.seccion_electoral).seccion + ((escuela.prioridad === 1) ? " [OBJETIVO]" : ""), // + " - " + (escuela.partido_ ? escuela.partido_.name : ""),
        value: escuela.id,
        prioridad: escuela.prioridad
      }
    };

    const setWarning = (option) => {
      setLocalError(option && option.prioridad !== 1 ? 'Advertencia: no es escuela objetivo' : null);
      return option;
    }

    const loadOptions = async (inputValue) => {
      let {data} = await searchEscuelas(inputValue, {distrito, seccion});
      return extraOptions.concat(data.map(formatOption))
    };

    // eslint-disable-next-line
    const loadByValue = value => extraOptions.find(option => option.value == value) || getEscuela(value).then(({data}) => setWarning(formatOption(data)));

    return (
      <AutocompleteField
        loadOptions={loadOptions}
        loadByValue={loadByValue}
        onChangeExtra={option => setWarning(option)}
        localError={localError}
        {...rest}
      />

    );
  }
;

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
