import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import VotingForm from "components/Votings/VotingForm";
import { postVoting } from "api/modules/votings.api";
import { toast } from "react-toastify";

const CreateVoting = () => {
  const history = useHistory();

  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const returnToHome = () => {
    history.push("/sistema/votaciones");
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await postVoting(data);
      const positionId = response.data.id;
      toast.info("La votación ha sido creada exitosamente");
      history.push(`/sistema/votaciones/${positionId}`);
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al crear la votación");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">Nueva votación</h2>
            Volver al <Link to="/votaciones">listado de votaciones</Link>
          </div>
          <div></div>
        </div>
        <hr />
        <VotingForm
          onSubmit={onSubmit}
          discardChanges={returnToHome}
          isSubmitting={isSubmitting}
          errors={hasErrors}
        />
      </div>
    </div>
  );
};

export default CreateVoting;
