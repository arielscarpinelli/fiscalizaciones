import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

import moment from "moment";

const DateTimeField = ({ name, label, readOnly, ...rest }) => {
  const {
    register,
    errors,
    getValues,
    setValue,
    clearErrors,
  } = useFormContext();

  const initField = () => {
    const datetime = getValues(name);
    if (datetime) {
      const parsedDateTime = new Date(datetime);

      setDate(moment(parsedDateTime).format("Y-MM-DD"));
      setTime(moment(parsedDateTime).format("HH:mm"));
    }
  };
  useEffect(initField, []);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const updateDateTimeHandler = () => {
    if (date && time) {
      const newdatetime = new Date(`${date}T${time}`).toISOString();
      setValue(name, newdatetime);
      clearErrors(name);
    }
  };

  useEffect(updateDateTimeHandler, [date, time]);

  const updateDate = (event) => {
    setDate(event.target.value);
  };

  const updateTime = (event) => {
    setTime(event.target.value);
  };

  const error = errors[name] ? errors[name].message : null;

  return (
    <>
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <div className="input-group">
          <input type="text" hidden id={name} name={name} ref={register} />
          <input
            type="date"
            className={`form-control ${error ? "is-invalid" : ""}`}
            readOnly={readOnly}
            onChange={updateDate}
            value={date}
            {...rest}
          />
          <input
            type="time"
            className={`form-control ${error ? "is-invalid" : ""}`}
            readOnly={readOnly}
            onChange={updateTime}
            value={time}
            {...rest}
          />
        </div>
        {error && <small className="text-danger">{error}</small>}
      </div>
    </>
  );
};

DateTimeField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
};

DateTimeField.defaultProps = {
  readOnly: false,
};

export default DateTimeField;
