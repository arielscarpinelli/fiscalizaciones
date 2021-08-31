import React from "react";
import PropTypes from "prop-types";

import {getSeccionElectoral} from "utils/geo";
import {getEscuela, searchEscuelas} from "api/modules/escuelas.api";
import AutocompleteField from "components/Forms/AutocompleteField";

const SelectEscuelaField = ({distrito, seccion, extraOptions = [], ...rest}) => {

        const formatOption = escuela => {
            return {
                label: escuela.codigo + " - " + escuela.nombre + " - " + getSeccionElectoral(escuela.distrito, escuela.seccion_electoral).seccion, // + " - " + (escuela.partido_ ? escuela.partido_.name : ""),
                value: escuela.id
            }
        };

        const loadOptions = async (inputValue) => {
            let {data} = await searchEscuelas(inputValue, { distrito, seccion });
            return extraOptions.concat(data.map(formatOption))
        };


        const loadByValue = value => extraOptions.find(option => option.value == value) || getEscuela(value).then(({data}) => formatOption(data));

        return (
            <AutocompleteField
                loadOptions={loadOptions}
                loadByValue={loadByValue}
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
