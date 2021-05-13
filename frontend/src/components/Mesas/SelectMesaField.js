import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";

import { getMesasByEscuela } from "api/modules/mesas.api";
import { toast } from "react-toastify";

import SelectField from "components/Forms/SelectField";

const SelectMesaField = ({ name, label, readOnly, escuela, optional, ...rest }) => {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const invokeFetch = () => {
    fetch();
  };

  useEffect(invokeFetch, [escuela]);

  const fetch = async () => {
    setValues([]);

    if (!escuela) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await getMesasByEscuela(escuela);
      const list = data
        .map((item) => {
          return {
            value: item.id,
            text: item.codigo,
          };
        });
      setValues(list);
    } catch (error) {
      setValues([]);
      toast.error("Ha ocurrido un error al obtener las opciones");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SelectField
      name={name}
      label={label}
      readOnly={readOnly}
      options={(!optional ? [] : [{
        value: "",
        text: "-- Sin asignar --"
      }]).concat(values)}
      isLoading={loading}
      {...rest}
    />
  );
};

SelectMesaField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  optional: PropTypes.bool
};

SelectMesaField.defaultProps = {
  name: "mesa",
  label: "Mesa",
  readOnly: false,
  optional: true
};

export default SelectMesaField;
