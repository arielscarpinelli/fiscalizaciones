/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import MesaForm from "components/Mesas/MesaForm";
import {
  getMesa,
  putMesa,
  deleteMesa,
} from "api/modules/mesas.api";
import { toast } from "react-toastify";
import {handleFormSubmitError} from "utils/forms";

const ShowMesa = () => {
  const { id } = useParams();
  const history = useHistory();

  const [mesa, setMesa] = useState(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const invokeFetchVoting = () => {
    fetchMesaByParamId();
  }

  useEffect(invokeFetchVoting, []);

  const makeMesaEditable = () => {
    setIsReadonly(false);
  };

  const discardChanges = () => {
    setIsReadonly(true);
  };

  const fetchMesaByParamId = async () => {
    try {
      const response = await getMesa(id);
      setMesa(response.data);
    } catch (error) {
      setMesa(null);
      toast.error("No existe un mesa con ese identificador");
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await putMesa(id, data);
      setMesa((oldMesa) => {
        return {
          ...oldMesa,
          ...response.data,
        };
      });
      setIsReadonly(true);
      setSubmitting(false);
      toast.info("La mesa ha sido modificado exitosamente");
    } catch (error) {
      setSubmitting(false);
      handleFormSubmitError(error, setErrors)
    }
  };

  const removeMesa = async () => {
    if (
      confirm(
        `¿Deseas eliminar al mesa ${mesa.name}?`
      )
    ) {
      try {
        await deleteMesa(id);
        toast.info("La mesa ha sido eliminado exitosamente");
        history.push("/sistema/mesas");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar la mesa");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">
              {mesa
                ? mesa.name
                : "Mesa"}
            </h2>
            Volver al <Link to="/sistema/mesas">listado de mesas</Link>
          </div>
          <div>
            {isReadonly && (
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={makeMesaEditable}
                >
                  Modificar mesa
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={removeMesa}
                >
                  Eliminar mesa
                </button>
              </div>
            )}
          </div>
        </div>
        <hr />
        {mesa && (
          <MesaForm
            onSubmit={onSubmit}
            discardChanges={discardChanges}
            mesa={mesa}
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

export default ShowMesa;
