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
                               ...rest
                           }) => {
    const {getValues, errors} = useFormContext();

    const error = errors[name] ? errors[name].message : null;

    const [defaultValue, setDefaultValue] = useState();

    const loadDefaultValue = async () => {
        const value = getValues(name);
        if (value) {
            const fullValue = await loadByValue(value);
            setDefaultValue(fullValue);
        } else {
            setDefaultValue({
                dummy: true
            })
        }
    }

    let invokeLoadDefaultValue = () => {
        loadDefaultValue();
    };

    useEffect(invokeLoadDefaultValue, [])

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <Controller
                name={name}
                render={({onChange, onBlur}) => defaultValue ? <AsyncSelect
                        name={name}
                        onChange={option => onChange(option && option.value)}
                        onBlur={onBlur}
                        className={`${error ? "is-invalid" : ""}`}
                        isDisabled={readOnly}
                        cacheOptions
                        defaultOptions={[defaultValue]}
                        defaultValue={defaultValue}
                        loadOptions={debounce(loadOptions, 250)}
                        {...rest}
                    /> : <Spinner/>
                }/>
            {error && <small className="text-danger">{error}</small>}
        </div>
    );
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