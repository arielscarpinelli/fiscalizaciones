/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import EscuelaForm from "components/Escuelas/EscuelaForm";
import {
  getEscuela,
  putEscuela,
  deleteEscuela,
} from "api/modules/escuelas.api";
import { toast } from "react-toastify";

const ShowEscuela = () => {
  const { id } = useParams();
  const history = useHistory();

  const [escuela, setEscuela] = useState(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const invokeFetchVoting = () => {
    fetchEscuelaByParamId();
  }

  useEffect(invokeFetchVoting, []);

  const makeEscuelaEditable = () => {
    setIsReadonly(false);
  };

  const discardChanges = () => {
    setIsReadonly(true);
  };

  const fetchEscuelaByParamId = async () => {
    try {
      const response = await getEscuela(id);
      setEscuela(response.data);
    } catch (error) {
      setEscuela(null);
      toast.error("No existe un escuela con ese identificador");
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await putEscuela(id, data);
      setEscuela((oldEscuela) => {
        return {
          ...oldEscuela,
          ...response.data,
        };
      });
      setIsReadonly(true);
      setSubmitting(false);
      toast.info("La escuela ha sido modificado exitosamente");
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al modificar la escuela");
      }
    }
  };

  const removeEscuela = async () => {
    if (
      confirm(
        `¿Deseas eliminar al escuela ${escuela.nombre}?`
      )
    ) {
      try {
        await deleteEscuela(id);
        toast.info("La escuela ha sido eliminado exitosamente");
        history.push("/sistema/escuelas");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar la escuela");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">
              {escuela
                ? escuela.name
                : "Escuela"}
            </h2>
            Volver al <Link to="/sistema/escuelas">listado de escuelas</Link>
          </div>
          <div>
            {isReadonly && (
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={makeEscuelaEditable}
                >
                  Modificar escuela
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={removeEscuela}
                >
                  Eliminar escuela
                </button>
              </div>
            )}
          </div>
        </div>
        <hr />
        {escuela && (
          <EscuelaForm
            onSubmit={onSubmit}
            discardChanges={discardChanges}
            escuela={escuela}
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

export default ShowEscuela;
