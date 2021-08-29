import React, {useEffect, useState} from "react";
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
import {DISTRITO_DEFAULT, getSeccionesElectoralesByDistrito} from "utils/geo";
import SelectActaEstadoField from "components/Actas/SelectActaEstadoField";
import {getActaTemplate} from "api/modules/actas.api";
import {toast} from "react-toastify";

const ActaForm = ({
                    onSubmit,
                    acta,
                    isReadonly,
                    isSubmitting,
                    errors,
                    onCancel
                  }) => {

  const [detalle, setDetalle] = useState(acta.detalle || [])

  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: acta || {},
    mode: "all",
  });

  const distrito = useWatch({
    control: form.control,
    name: 'distrito',
  }) || DISTRITO_DEFAULT;

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  const handleReset = () => {
    form.reset(acta);
    setDetalle(acta.detalle || []);
  };

  useEffect(handleReset, [acta]);

  const seccion_electoral = useWatch({
    control: form.control,
    name: 'seccion_electoral',
  }) || getSeccionesElectoralesByDistrito(distrito)[0].value

  const fetchTemplate = async () => {
    try {
      const result = await getActaTemplate(distrito, seccion_electoral)
      const currentDetalle = acta.detalle || [];
      setDetalle(result.data.detalle.map((d, i) => ({
        ...currentDetalle[i],
        ...d
      })))
    } catch (e) {
      console.error(e);
      toast.error("Imposible cargar listas del municipio")
    }
  }

  const invokeFetchTemplate = () => {
    fetchTemplate();
  }

  useEffect(invokeFetchTemplate, [seccion_electoral])

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
                <div className="col-3">
                  <SelectDistritoField name="distrito" label="Provincia" readOnly={isReadonly}/>
                </div>
                <div className="col">
                  <SelectSeccionElectoralField distrito={distrito} name="seccion_electoral" label="Municipio" readOnly={isReadonly}/>
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
                {/*
                <div className="col">
                  <TextField
                    name="sobres"
                    label="Sobres"
                    readOnly={isReadonly}
                  />
                </div>
                */}
              </div>

              <hr/>

              <div className="sticky">
              <table className="acta-detalle table">
                <thead className="card-header">
                  <tr>
                    <th>
                      Lista
                    </th>
                    <th>
                      Dipu. Nac.
                    </th>
                    <th>
                      Dipu. Prov.
                    </th>
                    <th>
                      Concejales
                    </th>
                    <th>
                      Sena. Prov.
                    </th>
                  </tr>
                </thead>
                <tbody>
              {detalle.map((d, i) =>
                <tr key={i}>
                  <th>{d.lista || d.tipo}
                    <HiddenField name={"detalle[" + i + "].lista"}/>
                  </th>

                  <td>
                      <TextField
                        name={"detalle[" + i + "].diputados_nacionales"}
                        label=""
                        readOnly={isReadonly}
                      />
                    </td>
                  <td>
                      <TextField
                        name={"detalle[" + i + "].diputados_provinciales"}
                        readOnly={isReadonly}
                      />
                    </td>

                  <td>
                    <TextField
                      name={"detalle[" + i + "].concejales"}
                      readOnly={isReadonly}
                    />
                  </td>
                  <td>
                    <TextField
                      name={"detalle[" + i + "].senadores_provinciales"}
                      readOnly={isReadonly}
                    />
                  </td>
                </tr>
              )}
                </tbody>
              </table>
                {/*}
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
                */}

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
