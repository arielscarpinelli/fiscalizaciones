import React from "react";
import {toast} from "react-toastify";
import {useHistory, useLocation} from "react-router-dom";
import {useQuery} from "utils/router";

export const handleServersideValidationErrors = (errors, setError) => {
  if (!errors || Object.keys(errors).length === 0) {
    return false;
  }

  Object.entries(errors).forEach(([field, message]) => {
    setError(field, {
      type: "manual",
      message,
    });
  });
};


export const handleFormSubmitError = (error, setErrors) =>{
  if (error && error.response && error.response.data && error.response.data.errors && Object.keys(error.response.data.errors).length) {
    toast.warn("Alguno de los datos ingresados son inválidos");
    setErrors(error.response.data.errors);
  } else {
    toast.error((error && error.response && error.response.data && error.response.data.message) || "Ha ocurrido un error");
  }
}

export const SearchContext = ({children}) => {

  const history = useHistory();
  const location = useLocation();
  const params = useQuery();

  const onChange = (field) => (valueOrEvent) => {
    const value = valueOrEvent && valueOrEvent.target ? valueOrEvent.target.value : valueOrEvent;
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(field, value)
    } else {
      params.delete(field);
    }
    params.delete("page");
    history.push({
      ...location,
      search: params.toString()
    });
  }

  return React.Children.map(children, (child, index) => {
    const event = child.type === "input" ?  "onBlur": "onChange";
    return React.cloneElement(child, {
      [event]: onChange(child.props.name),
      defaultValue: params[child.props.name]
    });
  });

}