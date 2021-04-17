import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SelectField from "./SelectField";
import { getLocationsFromProvince } from "api/modules/geo.api";
import { toast } from "react-toastify";

const SelectLocationField = ({ name, label, readOnly, province, ...rest }) => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const invokeFetchLocations = () => {
    fetchLocations();
  };

  useEffect(invokeFetchLocations, [province]);

  const fetchLocations = async () => {
    setLocations([]);
    if (!province) {
      return false;
    }
    setLoading(true);
    try {
      const { data } = await getLocationsFromProvince(province);
      const list = data
        .map((location) => {
          return {
            value: location.id,
            text: location.nombre,
          };
        })
        .sort((a, b) => (a.text > b.text ? 1 : -1));
      setLocations(list);
    } catch (error) {
      setLocations([]);
      toast.error("Ha ocurrido un error al obtener las localidades");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SelectField
      name={name}
      label={label}
      readOnly={readOnly}
      options={locations}
      isLoading={isLoading}
      {...rest}
    />
  );
};

SelectLocationField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  province: PropTypes.string,
};

SelectLocationField.defaultProps = {
  name: "province",
  label: "Municipio",
  readOnly: false,
  province: null,
};

export default SelectLocationField;
