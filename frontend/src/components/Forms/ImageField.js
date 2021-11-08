import React, {useRef, useState} from "react";
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

  const [rotated, setRotated] = useState();

  const imageRef = useRef();

  const rotate = direction => {
    const canvas = document.createElement('canvas');
    const image = imageRef.current;

    canvas.width = image.naturalHeight;
    canvas.height = image.naturalWidth;

    const context = canvas.getContext("2d");
    context.translate(canvas.width/2,canvas.height/2);

    // rotate the canvas to the specified degrees
    context.rotate(direction * Math.PI/2);

    context.drawImage(image,-image.naturalWidth/2,-image.naturalHeight/2);

    canvas.toBlob(blob => setRotated(URL.createObjectURL(blob)));

  }

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
              src={rotated || img}
              className="d-block foto"
              alt={label}
              ref={imageRef}
              onLoad={(e) => (typeof current !== "string" || rotated) && URL.revokeObjectURL(e.target.src)}
            />
          </div>}
          {img && <div className="btn-group" role="group">
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => rotate( -1)}>Rotar izquierda</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => rotate( +1)}>Rotar derecha</button>
          </div>}
          {!readOnly && (
            <div><label className="btn btn-sm btn-secondary">
              <input
                type="file"
                accept="image/*"
                name={name}
                ref={ref}
                hidden
                onChange={e => {e.target.files.length && onChange(e.target.files); setRotated(null)}}
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
