import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {FormProvider, useForm, useWatch} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";

import {handleServersideValidationErrors} from "utils/forms";

import validation from "./validation";
import TextField from "components/Forms/TextField";
import SelectDistritoField from "components/Geo/SelectDistritoField";
import SelectSeccionElectoralField from "components/Geo/SelectSeccionElectoralField";
import {DISTRITO_DEFAULT} from "utils/geo";
import SelectPartidoField from "components/Partidos/SelectPartidoField";

const EscuelaForm = ({
  onSubmit,
  discardChanges,
  escuela,
  isReadonly,
  isSubmitting,
  errors,
}) => {

  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: escuela || {},
    mode: "all",
  });

  const distrito = useWatch({
    control: form.control,
    name: 'distrito',
  })

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  const handleReset = () => {
    form.reset(escuela);
    discardChanges();
  };

  return (
    <div className="card">
      <div className="card-body">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-lg-3">
                <TextField
                    name="codigo"
                    label="Codigo"
                    type="number"
                    readOnly={isReadonly}
                />
              </div>
              <div className="col-lg-9">
                <TextField
                  name="nombre"
                  label="Nombre"
                  readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <TextField
                    name="direccion"
                    label="Direccion"
                    readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <SelectDistritoField readOnly={isReadonly}/>
              </div>
              <div className="col-6">
                <SelectSeccionElectoralField distrito={distrito || DISTRITO_DEFAULT} readOnly={isReadonly}/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <SelectPartidoField readOnly={isReadonly}/>
              </div>
              <div className="col-6">
                <TextField
                    name="circuito"
                    label="Circuito (opcional)"
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

EscuelaForm.propTypes = {
  onSubmit: PropTypes.func,
  discardChanges: PropTypes.func.isRequired,
  escuela: PropTypes.object,
  isReadonly: PropTypes.bool,
  fromEdit: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

EscuelaForm.defaultProps = {
  onSubmit: () => {},
  escuela: {},
  isReadonly: false,
  fromEdit: false,
};

export default EscuelaForm;
