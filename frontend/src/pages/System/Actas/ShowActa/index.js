/* eslint-disable no-restricted-globals */
import React, {useEffect, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {handleFormSubmitError} from "utils/forms";
import ActaForm from "components/Actas/ActaForm";
import {deleteActa, getActa, putActa} from "api/modules/actas.api";

const ShowActa = () => {
  const { id } = useParams();
  const history = useHistory();

  const [acta, setActa] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const invokeFetchActa = () => {
    fetchActa(id);
  }

  useEffect(invokeFetchActa, []);

  const fetchActa = async (id, params) => {
    try {
      const response = await getActa(id, params);
      setActa(response.data);
      return response.data;
    } catch (error) {
      setActa(null);
      toast.error("No existe un acta con ese identificador");
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await putActa(id, data);
      setActa(response.data);
      setSubmitting(false);
      toast.info("El acta ha sido modificada exitosamente");
    } catch (error) {
      setSubmitting(false);
      handleFormSubmitError(error, setErrors)
    }
  };

  const onSubmitAndNext = async (data) => {
    data.estado = 'VERIFICADA';
    await onSubmit(data);
    const nextActa = await fetchActa('next', { eleccion: acta.eleccion });
    history.push("/sistema/actas/" + nextActa.id);
    window.scroll(0,0);
  }

  const onDismiss = async (data) => {
    data.estado = 'ILEGIBLE';
    await onSubmit(data);
    const nextActa = await fetchActa('next', { eleccion: acta.eleccion });
    history.push("/sistema/actas/" + nextActa.id);
    window.scroll(0,0);
  }

  const removeActa = async () => {
    if (
      confirm(
        `¿Deseas eliminar el acta de la mesa ${acta.mesa}?`
      )
    ) {
      try {
        await deleteActa(id);
        toast.info("El acta ha sido eliminada exitosamente");
        history.push("/sistema/actas");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Ha ocurrido un error al eliminar el acta");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">
              Editar acta
            </h2>
            Volver al <Link to="/sistema/actas">Volver al listado de actas</Link>
          </div>
          <div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={removeActa}
            >
              Eliminar acta
            </button>
          </div>
        </div>
        <hr />
        {acta && (
          <ActaForm
            onSubmit={onSubmit}
            onSubmitAndNext={onSubmitAndNext}
            onDismiss={onDismiss}
            acta={acta}
            isSubmitting={isSubmitting}
            errors={hasErrors}
            fromEdit
          />
        )}
      </div>
    </div>
  );
};

export default ShowActa;
