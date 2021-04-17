/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import PositionForm from "components/Positions/PositionForm";
import {
  getPosition,
  putPosition,
  deletePosition,
} from "api/modules/positions.api";
import { toast } from "react-toastify";

const ShowPosition = () => {
  const { id } = useParams();
  const history = useHistory();

  const [position, setPosition] = useState(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const invokeFetchVoting = () => {
    fetchPositionByParamId();
  };

  useEffect(invokeFetchVoting, []);

  const makePositionEditable = () => {
    setIsReadonly(false);
  };

  const discardChanges = () => {
    setIsReadonly(true);
  };

  const fetchPositionByParamId = async () => {
    try {
      const response = await getPosition(id);
      setPosition(response.data);
    } catch (error) {
      setPosition(null);
      toast.error("No existe una posición con ese identificador");
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await putPosition(id, data);
      setPosition((oldPosition) => {
        return {
          ...oldPosition,
          ...response.data,
        };
      });
      setIsReadonly(true);
      toast.info("La posición ha sido modificada exitosamente");
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al modificar la posición");
      }
    }
  };

  const removePosition = async () => {
    if (confirm(`¿Deseas eliminar la posición ${position.name}?`)) {
      try {
        await deletePosition(id);
        toast.info("La posición ha sido eliminada exitosamente");
        history.push("/sistema/posiciones");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar la posición");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">{position ? position.name : "Posición"}</h2>
            Volver al <Link to="posiciones">listado de posiciones</Link>
          </div>
          <div>
            {isReadonly && (
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={makePositionEditable}
                >
                  Modificar posición
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={removePosition}
                >
                  Eliminar posición
                </button>
              </div>
            )}
          </div>
        </div>
        <hr />
        {position && (
          <PositionForm
            onSubmit={onSubmit}
            discardChanges={discardChanges}
            position={position}
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

export default ShowPosition;
