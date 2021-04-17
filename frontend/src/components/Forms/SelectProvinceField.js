import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SelectField from "./SelectField";
import { getProvinces } from "api/modules/geo.api";
import { toast } from "react-toastify";

const SelectProvinceField = ({ name, readOnly, label, ...rest }) => {
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const { data } = await getProvinces();
      const list = data.map((province) => {
        return {
          value: province.id,
          text: province.nombre,
        };
      });
      setProvinces(list);
    } catch (error) {
      console.log(error);
      setProvinces([]);
      toast.error("Ha ocurrido un error al obtener las provincias");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SelectField
      name={name}
      readOnly={readOnly}
      options={provinces}
      label={label}
      isLoading={isLoading}
      {...rest}
    />
  );
};

SelectProvinceField.propTypes = {
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  label: PropTypes.string,
};

SelectProvinceField.defaultProps = {
  name: "province",
  label: "Provincia",
  readOnly: false,
};

export default SelectProvinceField;
