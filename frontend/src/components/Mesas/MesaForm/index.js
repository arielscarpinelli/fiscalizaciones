import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {FormProvider, useForm} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";

import {handleServersideValidationErrors} from "utils/forms";

import validation from "./validation";
import TextField from "components/Forms/TextField";
import SelectEscuelaField from "components/Escuelas/SelectEscuelaField";

const MesaForm = ({
  onSubmit,
  discardChanges,
  mesa,
  isReadonly,
  isSubmitting,
  errors,
}) => {

  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: mesa || {},
    mode: "all",
  });

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  const handleReset = () => {
    form.reset(mesa);
    discardChanges();
  };

  return (
    <div className="card">
      <div className="card-body">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-lg-12">
                <SelectEscuelaField readOnly={isReadonly}/>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <TextField
                    name="codigo"
                    label="Numero de mesa"
                    readOnly={isReadonly}
                />
              </div>
              <div className="col-lg-3">
                <TextField
                    name="electores_femeninos"
                    label="Femeninos"
                    readOnly={isReadonly}
                />
              </div>
              <div className="col-lg-3">
                <TextField
                    name="electores_masculinos"
                    label="Masculinos"
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

MesaForm.propTypes = {
  onSubmit: PropTypes.func,
  discardChanges: PropTypes.func.isRequired,
  mesa: PropTypes.object,
  isReadonly: PropTypes.bool,
  fromEdit: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

MesaForm.defaultProps = {
  onSubmit: () => {},
  mesa: {},
  isReadonly: false,
  fromEdit: false,
};

export default MesaForm;
