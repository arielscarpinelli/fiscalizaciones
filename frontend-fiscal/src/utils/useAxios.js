import { useState } from "react";
import {toast} from "react-toastify";

const useAxios = ({ submitFn, onSuccess = () => {}, onError = () => {} }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const onSubmit = async (...args) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await submitFn(...args);
      onSuccess(response);
    } catch (error) {
      // if (!error.isAxiosError) {
      //   return onError(error);
      // }
      if (error && error.response && error.response.data && error.response.data.errors && Object.keys(error.response.data.errors).length) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error?.response?.data?.errors || {});
      } else {
        toast.error((error?.response?.data?.message) || "Ha ocurrido un error");
      }
      onError(error.response);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting,
    errors,
  };
};

export default useAxios;
