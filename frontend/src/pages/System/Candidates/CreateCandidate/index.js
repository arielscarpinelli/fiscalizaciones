import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import CandidateForm from "components/Candidates/CandidateForm";
import { postCandidate } from "api/modules/candidates.api";
import { toast } from "react-toastify";

const CreateCandidate = () => {
  const history = useHistory();

  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const returnToHome = () => {
    history.push("/sistema/candidatos");
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await postCandidate(data);
      const candidateId = response.data.id;
      toast.info("El candidato ha sido creado exitosamente");
      history.push(`/sistema/candidatos/${candidateId}`);
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al crear el candidato");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">Nuevo candidato</h2>
            Volver al <Link to="/sistema/candidatos">listado de candidatos</Link>
          </div>
          <div></div>
        </div>
        <hr />
        <CandidateForm
          onSubmit={onSubmit}
          discardChanges={returnToHome}
          isSubmitting={isSubmitting}
          errors={hasErrors}
        />
      </div>
    </div>
  );
};

export default CreateCandidate;
