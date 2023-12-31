import React, {useState, useEffect, useContext} from "react";
import PropTypes from "prop-types";

import { getPartidos } from "api/modules/partidos.api";
import { toast } from "react-toastify";

import SelectField from "components/Forms/SelectField";
import UserContext, { getUserPartido } from "context/UserContext";

const SelectPartidoField = ({ name, label, readOnly, ...rest }) => {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const { userData } = useContext(UserContext);

  const invokeFetch = () => {
    fetch();
  };

  useEffect(invokeFetch, []);

  const fetch = async () => {
    setValues([]);
    setLoading(true);

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

  const restrictedValues = values.filter(p => readOnly || !getUserPartido(userData) || (p.value === getUserPartido(userData)));

  return (
    <SelectField
      name={name}
      label={label}
      readOnly={readOnly}
      options={restrictedValues}
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
