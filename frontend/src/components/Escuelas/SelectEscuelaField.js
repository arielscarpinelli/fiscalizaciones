import React, {useContext} from "react";
import PropTypes from "prop-types";

import UserContext from "context/UserContext";
import {getSeccionElectoral} from "utils/geo";
import {getEscuela, searchEscuelas} from "api/modules/escuelas.api";
import AutocompleteField from "components/Forms/AutocompleteField";

const SelectEscuelaField = ({...rest}) => {

        const {userData} = useContext(UserContext);

        const formatOption = escuela => {
            return {
                label: escuela.codigo + " - " + escuela.nombre + " - " + getSeccionElectoral(escuela.distrito, escuela.seccion_electoral).seccion + " - " + (escuela.partido_ ? escuela.partido_.name : ""),
                value: escuela.id
            }
        };

        const loadOptions = async (inputValue) => {
            // TODO aplicar filtro por distrito/seccion electoral del usuario si tiene.
            let {data} = await searchEscuelas(inputValue);
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
