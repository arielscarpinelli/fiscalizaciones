import {toast} from "react-toastify";

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