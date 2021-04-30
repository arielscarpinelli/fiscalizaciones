import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {FormProvider, useForm, useWatch} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";

import {handleServersideValidationErrors} from "utils/forms";

import validation from "./validation";
import TextField from "components/Forms/TextField";

import SelectPartidoField from "components/Partidos/SelectPartidoField";
import SelectDistritoField from "components/Geo/SelectDistritoField";
import SelectSeccionElectoralField from "components/Geo/SelectSeccionElectoralField";

import {DISTRITO_DEFAULT} from "utils/geo";

const FiscalForm = ({
  onSubmit,
  discardChanges,
  fiscal,
  isReadonly,
  isSubmitting,
  errors,
  fromEdit,
}) => {
  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: fiscal || {},
    mode: "onSubmit",
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
    form.reset(fiscal);
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
                  name="first_name"
                  label="Nombre"
                  readOnly={isReadonly}
                />
              </div>
              <div className="col-lg-6">
                <TextField
                  name="last_name"
                  label="Apellido"
                  readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <TextField
                  name="dni"
                  label="Número de Documento"
                  readOnly={isReadonly}
                />
              </div>
              <div className="col-lg-6">
                <TextField
                  name="phone"
                  label="Teléfono Celular"
                  readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <TextField
                  name="address"
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
            </div>
            <div className="row">
              <div className="col-6">
                <TextField
                  name="escuela"
                  label="Escuela asginada (opcional)"
                  readOnly={isReadonly}
                />
              </div>
              <div className="col-6">
                <TextField
                  name="mesa"
                  label="Mesa asignada (opcional)"
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

FiscalForm.propTypes = {
  onSubmit: PropTypes.func,
  discardChanges: PropTypes.func.isRequired,
  fiscal: PropTypes.object,
  isReadonly: PropTypes.bool,
  fromEdit: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

FiscalForm.defaultProps = {
  onSubmit: () => { },
  fiscal: {},
  isReadonly: false,
  fromEdit: false,
};

export default FiscalForm;
