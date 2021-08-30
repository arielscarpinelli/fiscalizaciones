import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {FormProvider, useForm} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";

import {handleServersideValidationErrors} from "utils/forms";

import validation from "./validation";
import ImageField from "components/Forms/ImageField";
import HiddenField from "components/Forms/HiddenField";
import Spinner from "components/Spinner";
import NumberField from "components/Forms/NumberField";

const ActaForm = ({
                    onSubmit,
                    acta,
                    isReadonly,
                    isSubmitting,
                    errors,
                    onCancel
                  }) => {
  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: acta || {},
    mode: "all",
  });

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  const handleReset = () => {
    form.reset(acta);
  };

  useEffect(handleReset, [acta]);


  return (
    <div className="card">
      <div className="card-body">
        <FormProvider {...form}>
          <form className="row" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="col-md-8">
              <div className="row">
                <div className="col-auto mx-auto">
                  <ImageField label="Foto" name="foto" readOnly={isReadonly}/>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="row">
                <div className="col">
                  <NumberField
                    name="mesa"
                    label="Mesa"
                    readOnly={isReadonly}
                  />
                </div>
                <div className="col">
                  <NumberField
                    name="electores"
                    label="Electores"
                    readOnly={isReadonly}
                  />
                </div>
                {/*
                <div className="col">
                  <NumberField
                    name="sobres"
                    label="Sobres"
                    readOnly={isReadonly}
                  />
                </div>
                */}
              </div>

              {(acta.detalle || []).map((d, i) =>
                <React.Fragment key={i}>
                  <h4>Lista {d.lista}</h4>
                  <hr/>
                  <HiddenField name={"detalle[" + i + "].lista"}/>

                  <div className="row">
                    <div className="col">
                      <NumberField
                        name={"detalle[" + i + "].diputados_nacionales"}
                        label="Diputados Nac."
                        readOnly={isReadonly}
                      />
                    </div>
                    <div className="col">
                      <NumberField
                        name={"detalle[" + i + "].diputados_provinciales"}
                        label="Diputados Prov."
                        readOnly={isReadonly}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <NumberField
                        name={"detalle[" + i + "].concejales"}
                        label="Concejales"
                        readOnly={isReadonly}
                      />
                    </div>
                    <div className="col">
                      <NumberField
                        name={"detalle[" + i + "].senadores_provinciales"}
                        label="Senadores Prov."
                        readOnly={isReadonly}
                      />
                    </div>
                  </div>
                </React.Fragment>
              )}
              {/*

              <hr/>
              <div className="row">
                <div className="col">
                  <NumberField
                    name="especiales.nulos"
                    label="Nulos"
                    readOnly={isReadonly}
                  />
                </div>
                <div className="col">
                  <NumberField
                    name="especiales.recurridos"
                    label="Recurridos"
                    readOnly={isReadonly}
                  />
                </div>
                <div className="col">
                  <NumberField
                    name="especiales.impugnados"
                    label="Impugnados"
                    readOnly={isReadonly}
                  />
                </div>
              </div>
                */}

              {!isReadonly && (
                <div className="d-flex justify-content-center">
                  {!isSubmitting ? <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={hasErrors || isSubmitting}
                  >
                    Enviar
                  </button> : <Spinner/>}
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

ActaForm.propTypes = {
  onSubmit: PropTypes.func,
  acta: PropTypes.object,
  isReadonly: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

ActaForm.defaultProps = {
  onSubmit: () => {
  },
  acta: {},
  isReadonly: false,
};

export default ActaForm;
