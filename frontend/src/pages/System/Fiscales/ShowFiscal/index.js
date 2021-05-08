/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import FiscalForm from "components/Fiscales/FiscalForm";
import {
  getFiscal,
  putFiscal,
  deleteFiscal,
} from "api/modules/fiscales.api";
import { toast } from "react-toastify";
import {handleFormSubmitError} from "utils/forms";

const ShowFiscal = () => {
  const { id } = useParams();
  const history = useHistory();

  const [fiscal, setFiscal] = useState(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const invokeFetchVoting = () => {
    fetchFiscalByParamId();
  }

  useEffect(invokeFetchVoting, []);

  const makeFiscalEditable = () => {
    setIsReadonly(false);
  };

  const discardChanges = () => {
    setIsReadonly(true);
  };

  const fetchFiscalByParamId = async () => {
    try {
      const response = await getFiscal(id);
      setFiscal(response.data);
    } catch (error) {
      setFiscal(null);
      toast.error("No existe un fiscal con ese identificador");
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await putFiscal(id, data);
      setFiscal((oldFiscal) => {
        return {
          ...oldFiscal,
          ...response.data,
        };
      });
      setIsReadonly(true);
      setSubmitting(false);
      toast.info("El fiscal ha sido modificado exitosamente");
    } catch (error) {
      setSubmitting(false);
      handleFormSubmitError(error, setErrors)
    }
  };

  const removeFiscal = async () => {
    if (
      confirm(
        `¿Deseas eliminar al fiscal ${fiscal.first_name} ${fiscal.last_name}?`
      )
    ) {
      try {
        await deleteFiscal(id);
        toast.info("El fiscal ha sido eliminado exitosamente");
        history.push("/sistema/fiscales");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar el fiscal");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">
              {fiscal
                ? fiscal.first_name + " " + fiscal.last_name
                : "Fiscal"}
            </h2>
            Volver al <Link to="/sistema/fiscales">listado de fiscales</Link>
          </div>
          <div>
            {isReadonly && (
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={makeFiscalEditable}
                >
                  Modificar fiscal
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={removeFiscal}
                >
                  Eliminar fiscal
                </button>
              </div>
            )}
          </div>
        </div>
        <hr />
        {fiscal && (
          <FiscalForm
            onSubmit={onSubmit}
            discardChanges={discardChanges}
            fiscal={fiscal}
            isReadonly={isReadonly}
            isSubmitting={isSubmitting}
            errors={hasErrors}
            fromEdit
          />
        )}
      </div>
    </div>
  );
};

export default ShowFiscal;
