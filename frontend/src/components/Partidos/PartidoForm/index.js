import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {FormProvider, useForm} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";

import {handleServersideValidationErrors} from "utils/forms";

import validation from "./validation";
import TextField from "components/Forms/TextField";

const PartidoForm = ({
  onSubmit,
  discardChanges,
  partido,
  isReadonly,
  isSubmitting,
  errors,
}) => {

  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: partido || {},
    mode: "all",
  });

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  const handleReset = () => {
    form.reset(partido);
    discardChanges();
  };

  return (
    <div className="card">
      <div className="card-body">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-lg-12">
                <TextField
                  name="name"
                  label="Nombre"
                  readOnly={isReadonly}
                />
              </div>
            </div>
            {!isReadonly && (
              <div className="d-flex justify-content-between flex-row-reverse">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={hasErrors || isSubmitting}
                >
                  Guardar cambios
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

PartidoForm.propTypes = {
  onSubmit: PropTypes.func,
  discardChanges: PropTypes.func.isRequired,
  partido: PropTypes.object,
  isReadonly: PropTypes.bool,
  fromEdit: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

PartidoForm.defaultProps = {
  onSubmit: () => {},
  partido: {},
  isReadonly: false,
  fromEdit: false,
};

export default PartidoForm;
