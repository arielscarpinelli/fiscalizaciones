import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { handleServersideValidationErrors } from "utils/forms";
import validation from "./validation";
import TextField from "components/Forms/TextField";
import UserContext from "context/UserContext";

const LoginForm = ({ onSubmit, isSubmitting, errors }) => {
  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: {},
    mode: "all",
  });

  const {
    isLogged,
    setDNI,
    setEmailValidated,
    setPhone,
    setAuthToken,
  } = useContext(UserContext);

  const resetIfNotLogged = () => {
    if (!isLogged) {
      setAuthToken(null);
      setDNI(null);
      setEmailValidated(false);
      setPhone(null);
    }
  };

  useEffect(resetIfNotLogged, []);

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  return (
    <div className="card">
      <div className="card-body">
        <span className="h4">Ingresar</span>
        <hr></hr>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TextField
              name="dni"
              label="Número de Documento"
              placeholder="Ingresá tu número de documento"
            />
            <div className="d-flex justify-content-between flex-row-reverse">
              <button
                className="btn btn-unidos btn-unidos-primary"
                type="submit"
                disabled={hasErrors || isSubmitting}
              >
                Siguiente
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default LoginForm;
