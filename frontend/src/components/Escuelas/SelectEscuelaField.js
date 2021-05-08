import React from "react";
import PropTypes from "prop-types";

import {getSeccionElectoral} from "utils/geo";
import {getEscuela, searchEscuelas} from "api/modules/escuelas.api";
import AutocompleteField from "components/Forms/AutocompleteField";

const SelectEscuelaField = ({partido, ...rest}) => {

        const formatOption = escuela => {
            return {
                label: escuela.codigo + " - " + escuela.nombre + " - " + getSeccionElectoral(escuela.distrito, escuela.seccion_electoral).seccion + " - " + (escuela.partido_ ? escuela.partido_.name : ""),
                value: escuela.id
            }
        };

        const loadOptions = async (inputValue) => {
            let {data} = await searchEscuelas(inputValue, partido);
            return data.map(formatOption)
        };


        return (
            <AutocompleteField
                loadOptions={loadOptions}
                loadByValue={value => getEscuela(value).then(({data}) => formatOption(data))}
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
