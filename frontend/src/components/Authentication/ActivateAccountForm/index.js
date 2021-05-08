import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { handleServersideValidationErrors } from "utils/forms";
import validation from "./validation";
import TextField from "components/Forms/TextField";
const ActivateAccountForm = ({ onSubmit, isSubmitting, errors }) => {
  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: {},
    mode: "all",
  });

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  return (
    <div className="card">
      <div className="card-body">
        <span className="h4">
          Restablecer contraseña
        </span>
        <hr></hr>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TextField
              name="password"
              type="password"
              label="Nueva Contraseña"
              placeholder="Ingresá tu contraseña"
            />
            <TextField
              name="confirmPassword"
              type="password"
              label="Confirmación de tu contraseña"
              placeholder="Confirmá tu nueva contraseña"
            />
            <div className="d-flex justify-content-between flex-row-reverse">
              <button
                className="btn btn-unidos btn-unidos-primary"
                type="submit"
                disabled={hasErrors || isSubmitting}
              >
                Restablecer contraseña
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

ActivateAccountForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default ActivateAccountForm;
