import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { handleServersideValidationErrors } from "utils/forms";
import validation from "./validation";
import TextField from "components/Forms/TextField";
import SelectField from "components/Forms/SelectField";
import DateTimeField from "components/Forms/DateTimeField";

const VotingForm = ({
  onSubmit,
  discardChanges,
  voting,
  isReadonly,
  isSubmitting,
  errors,
}) => {
  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: voting || {},
    mode: "all",
  });

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  const handleReset = () => {
    form.reset(voting);
    discardChanges();
  };

  return (
    <div className="card">
      <div className="card-body">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-lg-6">
                <TextField
                  name="name"
                  label="Nombre de la votación"
                  readOnly={isReadonly}
                />
              </div>
              <div className="col-lg-6">
                <SelectField
                  name="type"
                  label="Tipo de la votación"
                  options={[
                    { value: "POLITICA", text: "Política" },
                    { value: "INTERNA", text: "Interna" },
                  ]}
                  readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <DateTimeField
                  name="votingStartDate"
                  label="Inicio de la votación"
                  readOnly={isReadonly}
                />
              </div>
              <div className="col-lg-6">
                <DateTimeField
                  name="votingEndDate"
                  label="Fin de la votación"
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
                  Descartar cambios
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

VotingForm.propTypes = {
  onSubmit: PropTypes.func,
  discardChanges: PropTypes.func.isRequired,
  voting: PropTypes.object,
  isReadonly: PropTypes.bool,
  fromEdit: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

VotingForm.defaultProps = {
  onSubmit: () => {},
  voting: {},
  isReadonly: false,
  fromEdit: false,
};

export default VotingForm;
