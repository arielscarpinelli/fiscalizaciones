import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {FormProvider, useForm} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";

import {handleServersideValidationErrors} from "utils/forms";
import validationCode from "utils/validationCode";
import TextField from "components/Forms/TextField";

const ValidateEmailForm = ({ onSubmit, isSubmitting, errors }) => {
  const form = useForm({
    resolver: joiResolver(validationCode),
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
        <div className="h4">Comprobá tu identidad</div>
        Te enviamos un <strong>código de verificación</strong> a tu email
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TextField
              name="code"
              label="Código de verificación"
              placeholder="Ingresá el código de verificación que enviamos a tu email"
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

ValidateEmailForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default ValidateEmailForm;
