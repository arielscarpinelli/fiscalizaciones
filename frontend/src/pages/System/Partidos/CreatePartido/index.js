import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import PartidoForm from "components/Partidos/PartidoForm";
import { postPartido } from "api/modules/partidos.api";
import { toast } from "react-toastify";
import {handleFormSubmitError} from "utils/forms";

const CreatePartido = () => {
  const history = useHistory();

  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const returnToHome = () => {
    history.push("/sistema/partidos");
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await postPartido(data);
      const partidoId = response.data.id;
      setSubmitting(false);
      toast.info("El partido ha sido creado exitosamente");
      history.push(`/sistema/partidos/${partidoId}`);
    } catch (error) {
      setSubmitting(false);
      handleFormSubmitError(error, setErrors)
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">Nuevo partido</h2>
            Volver al <Link to="/sistema/partidos">listado de partidos</Link>
          </div>
          <div></div>
        </div>
        <hr />
        <PartidoForm
          onSubmit={onSubmit}
          discardChanges={returnToHome}
          isSubmitting={isSubmitting}
          errors={hasErrors}
        />
      </div>
    </div>
  );
};

export default CreatePartido;
