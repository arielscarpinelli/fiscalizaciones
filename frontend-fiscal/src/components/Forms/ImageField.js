import React from "react";
import PropTypes from "prop-types";
import {Controller, useFormContext, useWatch} from "react-hook-form";

const ImageField = ({name, label, readOnly, ...rest}) => {
  const {errors} = useFormContext();

  const error = errors[name] ? errors[name].message : null;

  const current = useWatch({name});

  const img = current && (typeof current === "string"
    ? current
    : current[0]
      ? URL.createObjectURL(current[0])
      : null)


  return (
    <>
      <div className="form-group foto-container">
        {img && <img
          src={img}
          className="d-block foto"
          alt={label}
          onLoad={(e) => typeof current !== "string" && URL.revokeObjectURL(e.target.src)}
        />}
        {!readOnly && (
          <label className="btn btn-sm btn-secondary">
            <Controller
              defaultValue={null}
              name={name}
              render={({onChange, onBlur, ref}) => (<input
                  type="file"
                  accept="image/*"
                  name={name}
                  ref={ref}
                  hidden
                  onChange={e => onChange(e.target.files)}
                  onBlur={onBlur}
                />)
              }/>
            {img ? "Cambiar" : "Subir"} {label}
          </label>

        )}
        {error && <div><small className="text-danger">{error}</small></div>}
      </div>
    </>
  );
};

ImageField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
};

ImageField.defaultProps = {
  readOnly: false,
};

export default ImageField;
