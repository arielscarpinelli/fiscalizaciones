import React, {useState} from "react";
import PropTypes from "prop-types";
import {Controller, useFormContext, useWatch} from "react-hook-form";
import ImageMagnifier from "components/Forms/ImageMagnifier";

const URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

const ImageField = ({name, label, readOnly, ...rest}) => {
  const {errors} = useFormContext();

  const error = errors[name] ? errors[name].message : null;

  const current = useWatch({name});

  const img = current && (typeof current === "string"
    ? current
    : current[0]
      ? URL.createObjectURL(current[0])
      : null)

  const [rotate, doSetRotate] = useState(0);

  const setRotate = angle => doSetRotate(((angle < 0) ? (angle + 360) : angle) % 360)

  return (
    <Controller
      defaultValue={null}
      name={name}
      render={({onChange, onBlur, ref}) => (
        <div className="form-group foto-container"
             onDragOver={e => e.preventDefault()}
             onDrop={e => {
               e.dataTransfer.files.length && onChange(e.dataTransfer.files);
               e.preventDefault();
             }}>
          {img && <div style={{overflow: "hidden"}}>
            <ImageMagnifier
              src={img}
              className="d-block foto"
              alt={label}
              style={{
                transform: `rotate(${rotate}deg)`,
              }}
              onLoad={(e) => typeof current !== "string" && URL.revokeObjectURL(e.target.src)}
            />
          </div>}
          {img && <div className="btn-group" role="group">
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setRotate(rotate - 90)}>Rotar izquierda</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setRotate(rotate + 90)}>Rotar derecha</button>
          </div>}
          {!readOnly && (
            <div><label className="btn btn-sm btn-secondary">
              <input
                type="file"
                accept="image/*"
                name={name}
                ref={ref}
                hidden
                onChange={e => {e.target.files.length && onChange(e.target.files); setRotate(0)}}
                onBlur={onBlur}
              />
              {img ? "Cambiar" : "Subir"} {label}
            </label></div>
          )}
          {error && <div><small className="text-danger">{error}</small></div>}
        </div>)}/>
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
