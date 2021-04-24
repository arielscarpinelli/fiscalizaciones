/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import PartidoForm from "components/Partidos/PartidoForm";
import {
  getPartido,
  putPartido,
  deletePartido,
} from "api/modules/partidos.api";
import { toast } from "react-toastify";

const ShowPartido = () => {
  const { id } = useParams();
  const history = useHistory();

  const [partido, setPartido] = useState(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const invokeFetchVoting = () => {
    fetchPartidoByParamId();
  }

  useEffect(invokeFetchVoting, []);

  const makePartidoEditable = () => {
    setIsReadonly(false);
  };

  const discardChanges = () => {
    setIsReadonly(true);
  };

  const fetchPartidoByParamId = async () => {
    try {
      const response = await getPartido(id);
      setPartido(response.data);
    } catch (error) {
      setPartido(null);
      toast.error("No existe un partido con ese identificador");
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await putPartido(id, data);
      setPartido((oldPartido) => {
        return {
          ...oldPartido,
          ...response.data,
        };
      });
      setIsReadonly(true);
      setSubmitting(false);
      toast.info("El partido ha sido modificado exitosamente");
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al modificar el partido");
      }
    }
  };

  const removePartido = async () => {
    if (
      confirm(
        `¿Deseas eliminar al partido ${partido.name}?`
      )
    ) {
      try {
        await deletePartido(id);
        toast.info("El partido ha sido eliminado exitosamente");
        history.push("/sistema/partidos");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar el partido");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">
              {partido
                ? partido.name
                : "Partido"}
            </h2>
            Volver al <Link to="/sistema/partidos">listado de partidos</Link>
          </div>
          <div>
            {isReadonly && (
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={makePartidoEditable}
                >
                  Modificar partido
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={removePartido}
                >
                  Eliminar partido
                </button>
              </div>
            )}
          </div>
        </div>
        <hr />
        {partido && (
          <PartidoForm
            onSubmit={onSubmit}
            discardChanges={discardChanges}
            partido={partido}
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

export default ShowPartido;
