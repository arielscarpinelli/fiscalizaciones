/* eslint-disable no-restricted-globals */
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {handleFormSubmitError} from "utils/forms";
import ActaForm from "components/Actas/ActaForm";
import {postActa} from "api/modules/actas.api";

const CreateActa = () => {

  const [acta, setActa] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      await postActa(data);
      setActa({});
      setSubmitting(false);
      toast.info("El acta ha sido creada exitosamente");
    } catch (error) {
      setSubmitting(false);
      handleFormSubmitError(error, setErrors)
    }
  };

  return (
    <div className="row mb-4">
      <div className="col mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">
              Registrar acta
            </h2>
            Volver al <Link to="/sistema/actas">Volver al listado de actas</Link>
          </div>
        </div>
        <hr />
        <ActaForm
          onSubmit={onSubmit}
          acta={acta}
          isSubmitting={isSubmitting}
          errors={hasErrors}
          fromEdit
        />
      </div>
    </div>
  );
};

export default CreateActa;
