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

  const { isLogged, setAuth } = useContext(UserContext);

  const resetIfNotLogged = () => {
    if (!isLogged) {
      setAuth(null, null);
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
        <span className="h4">
          Ingresar al backoffice del sistema de votación
        </span>
        <hr></hr>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TextField
              name="email"
              label="Email"
              placeholder="Ingresá tu email"
            />
            <TextField
              name="password"
              type="password"
              label="Contraseña"
              placeholder="Ingresá tu contraseña"
            />
            <div className="d-flex justify-content-between flex-row-reverse">
              <button
                className="btn btn-unidos btn-unidos-primary"
                type="submit"
                disabled={hasErrors || isSubmitting}
              >
                Iniciar sesión
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
