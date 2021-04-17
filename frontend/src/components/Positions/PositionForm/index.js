import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { handleServersideValidationErrors } from "utils/forms";

import validation from "./validation";
import TextField from "components/Forms/TextField";
import TextAreaField from "components/Forms/TextAreaField";
import SelectField from "components/Forms/SelectField";

import SelectProvinceField from "components/Forms/SelectProvinceField";
import SelectLocationField from "components/Forms/SelectLocationField";
import NumberField from "components/Forms/NumberField";

const PositionForm = ({
  onSubmit,
  discardChanges,
  position,
  isReadonly,
  isSubmitting,
  errors,
}) => {
  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: position || {},
    mode: "all",
  });

  const [selectedJurisdiction, setJurisdiction] = useState(null);

  const province = form.watch("province");
  const jurisdiction = form.watch("jurisdiction");

  useEffect(() => {
    setJurisdiction(jurisdiction);
  }, [jurisdiction]);

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  const handleReset = () => {
    form.reset(position);
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
                  label="Nombre de la posición"
                  readOnly={isReadonly}
                />
              </div>
              <div className="col-lg-6">
                <SelectField
                  name="type"
                  label="Tipo de la posición"
                  options={[
                    { value: "POLITICA", text: "Política" },
                    { value: "INTERNA", text: "Interna" },
                  ]}
                  readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <SelectField
                  name="jurisdiction"
                  label="Jurisdicción de la posición"
                  options={[
                    { value: "NACIONAL", text: "Nacional" },
                    { value: "PROVINCIAL", text: "Provincial" },
                    { value: "MUNICIPAL", text: "Municipal" },
                  ]}
                  readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              {selectedJurisdiction && selectedJurisdiction !== "NACIONAL" && (
                <div className="col">
                  <SelectProvinceField name="province" readOnly={isReadonly} />
                </div>
              )}
              {selectedJurisdiction &&
                selectedJurisdiction === "MUNICIPAL" &&
                province && (
                  <div className="col">
                    <SelectLocationField
                      name="location"
                      readOnly={isReadonly}
                      province={province}
                    />
                  </div>
                )}
            </div>
            <div className="row">
              <div className="col-12">
                <NumberField
                  name="quantityRepresentatives"
                  min="1"
                  step="1"
                  label="Cantidad de representantes"
                  readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <TextAreaField
                  name="description"
                  label="Descripción de la posición"
                  readOnly={isReadonly}
                  rows="8"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <TextAreaField
                  name="requirements"
                  label="Requisitos de la posición"
                  readOnly={isReadonly}
                  rows="8"
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

PositionForm.propTypes = {
  onSubmit: PropTypes.func,
  discardChanges: PropTypes.func.isRequired,
  position: PropTypes.object,
  isReadonly: PropTypes.bool,
  fromEdit: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

PositionForm.defaultProps = {
  onSubmit: () => {},
  position: {},
  isReadonly: false,
  fromEdit: false,
};

export default PositionForm;
