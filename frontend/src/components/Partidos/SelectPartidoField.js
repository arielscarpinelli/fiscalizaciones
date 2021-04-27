import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { getPartidos } from "api/modules/partidos.api";
import { toast } from "react-toastify";
import SelectField from "components/Forms/SelectField";

const SelectPartidoField = ({ name, label, readOnly, ...rest }) => {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const invokeFetch = () => {
    fetch();
  };

  useEffect(invokeFetch, []);

  const fetch = async () => {
    setValues([]);
    // TODO: WTF: por que se validan los errores cuando pongo setLoading en true?
    //setLoading(true);

    try {
      const { data } = await getPartidos();
      const list = data
        .map((item) => {
          return {
            value: item.id,
            text: item.name,
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
      options={values}
      isLoading={loading}
      {...rest}
    />
  );
};

SelectPartidoField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
};

SelectPartidoField.defaultProps = {
  name: "partido",
  label: "Partido",
  readOnly: false,
};

export default SelectPartidoField;
