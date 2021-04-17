import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import PositionForm from "components/Positions/PositionForm";
import { postPosition } from "api/modules/positions.api";
import { toast } from "react-toastify";

const CreatePosition = () => {
  const history = useHistory();

  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const returnToHome = () => {
    history.push("/sistema/posiciones");
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await postPosition(data);
      const positionId = response.data.id;
      toast.info("La posición ha sido creada exitosamente");
      history.push(`/sistema/posiciones/${positionId}`);
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al crear la posición");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">Nueva posición</h2>
            Volver al <Link to="/sistema/posiciones">listado de posiciones</Link>
          </div>
          <div></div>
        </div>
        <hr />
        <PositionForm
          onSubmit={onSubmit}
          discardChanges={returnToHome}
          isSubmitting={isSubmitting}
          errors={hasErrors}
        />
      </div>
    </div>
  );
};

export default CreatePosition;
