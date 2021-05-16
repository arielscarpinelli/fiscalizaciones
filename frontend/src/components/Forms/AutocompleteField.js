import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Controller, useFormContext} from "react-hook-form";
import AsyncSelect from "react-select/async";
import Spinner from "components/Spinner";
import debounce from "debounce-promise";

const AutocompleteField = ({
                               name,
                               label,
                               readOnly,
                               loadByValue,
                               loadOptions,
                               onChange,
                               onBlur,
                               defaultValue,
                               ...rest
                           }) => {
    const {getValues, errors} = useFormContext() || {};

    const error = errors && errors[name] ? errors[name].message : null;

    const [loadedDefaultValue, setLoadedDefaultValue] = useState();

    const loadDefaultValue = async () => {
        const value = defaultValue ? defaultValue : getValues ? getValues(name) : undefined;
        if (value) {
            const fullValue = await loadByValue(value);
            setLoadedDefaultValue(fullValue);
        } else {
            setLoadedDefaultValue({
                dummy: true
            })
        }
    }

    let invokeLoadDefaultValue = () => {
        loadDefaultValue();
    };

    useEffect(invokeLoadDefaultValue, [])

    const render = ({onChange, onBlur}) => loadedDefaultValue ? <AsyncSelect
        name={name}
        placeholder={label}
        onChange={option => onChange(option && option.value)}
        onBlur={onBlur}
        className={`${error ? "is-invalid" : ""}`}
        isDisabled={readOnly}
        cacheOptions
        defaultOptions={!loadedDefaultValue.dummy ? [loadedDefaultValue] : true}
        defaultValue={!loadedDefaultValue.dummy ? loadedDefaultValue : undefined}
        loadOptions={debounce(loadOptions, 250)}
        {...rest}
    /> : <Spinner/>;

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            {!onChange ?
                <Controller name={name} render={render}/> :
                render({onChange, onBlur})}
            {error && <small className="text-danger">{error}</small>}
        </div>)
};

AutocompleteField.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
};

AutocompleteField.defaultProps = {
    options: [],
    readOnly: false,
};

export default AutocompleteField;
