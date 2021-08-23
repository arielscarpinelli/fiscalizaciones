import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {useForm, FormProvider, useWatch} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";

import {handleServersideValidationErrors} from "utils/forms";

import validation from "./validation";
import TextField from "components/Forms/TextField";
import ImageField from "components/Forms/ImageField";
import HiddenField from "components/Forms/HiddenField";
import Spinner from "components/Spinner";
import SelectDistritoField from "components/Geo/SelectDistritoField";
import SelectSeccionElectoralField from "components/Geo/SelectSeccionElectoralField";
import {DISTRITO_DEFAULT} from "utils/geo";
import SelectActaEstadoField from "components/Actas/SelectActaEstadoField";

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

  const distrito = useWatch({
    control: form.control,
    name: 'distrito',
  })


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
                <div className="col-2">
                  <label>Elección</label>
                  <div>{acta.eleccion_ ? acta.eleccion_.nombre : acta.eleccion}</div>
                </div>
                <div className="col-3">
                  <SelectDistritoField name="distrito" label="Provincia" readOnly={isReadonly}/>
                </div>
                <div className="col-7">
                  <SelectSeccionElectoralField distrito={distrito || DISTRITO_DEFAULT} name="seccion_electoral" label="Municipio" readOnly={isReadonly}/>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <TextField
                    name="mesa"
                    label="Mesa"
                    readOnly={isReadonly}
                  />
                </div>
                <div className="col">
                  <TextField
                    name="electores"
                    label="Electores"
                    readOnly={isReadonly}
                  />
                </div>
                <div className="col">
                  <TextField
                    name="sobres"
                    label="Sobres"
                    readOnly={isReadonly}
                  />
                </div>
              </div>

              {(acta.detalle || [{}]).map((d, i) =>
                <React.Fragment key={i}>
                  <h4>Lista {d.lista}</h4>
                  <hr/>
                  <HiddenField name={"detalle[" + i + "].lista"}/>

                  <div className="row">
                    <div className="col">
                      <TextField
                        name={"detalle[" + i + "].diputados_nacionales"}
                        label="Diputados Nac."
                        readOnly={isReadonly}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        name={"detalle[" + i + "].diputados_provinciales"}
                        label="Diputados Prov."
                        readOnly={isReadonly}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <TextField
                        name={"detalle[" + i + "].concejales"}
                        label="Concejales"
                        readOnly={isReadonly}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        name={"detalle[" + i + "].senadores_provinciales"}
                        label="Senadores Prov."
                        readOnly={isReadonly}
                      />
                    </div>
                  </div>
                </React.Fragment>
              )}

              <hr/>
              <div className="row">
                <div className="col">
                  <TextField
                    name="especiales.nulos"
                    label="Nulos"
                    readOnly={isReadonly}
                  />
                </div>
                <div className="col">
                  <TextField
                    name="especiales.recurridos"
                    label="Recurridos"
                    readOnly={isReadonly}
                  />
                </div>
                <div className="col">
                  <TextField
                    name="especiales.impugnados"
                    label="Impugnados"
                    readOnly={isReadonly}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <SelectActaEstadoField/>
                </div>
              </div>
              {!isReadonly && (
                <div className="d-flex justify-content-center">
                  {!isSubmitting ? <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={hasErrors || isSubmitting}
                  >
                    Guardar
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
