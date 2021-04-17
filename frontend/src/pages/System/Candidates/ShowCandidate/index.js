/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import CandidateForm from "components/Candidates/CandidateForm";
import {
  getCandidate,
  putCandidate,
  deleteCandidate,
} from "api/modules/candidates.api";
import { toast } from "react-toastify";

const ShowCandidate = () => {
  const { id } = useParams();
  const history = useHistory();

  const [candidate, setCandidate] = useState(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const invokeFetchVoting = () => {
    fetchCandidateByParamId();
  }

  useEffect(invokeFetchVoting, []);

  const makeCandidateEditable = () => {
    setIsReadonly(false);
  };

  const discardChanges = () => {
    setIsReadonly(true);
  };

  const fetchCandidateByParamId = async () => {
    try {
      const response = await getCandidate(id);
      setCandidate(response.data);
    } catch (error) {
      setCandidate(null);
      toast.error("No existe un candidato con ese identificador");
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await putCandidate(id, data);
      setCandidate((oldCandidate) => {
        return {
          ...oldCandidate,
          ...response.data,
        };
      });
      setIsReadonly(true);
      toast.info("El candidato ha sido modificado exitosamente");
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al modificar el candidato");
      }
    }
  };

  const removeCandidate = async () => {
    if (
      confirm(
        `¿Deseas eliminar al candidato ${candidate.first_name} ${candidate.last_name}?`
      )
    ) {
      try {
        await deleteCandidate(id);
        toast.info("El candidato ha sido eliminado exitosamente");
        history.push("/sistema/candidatos");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar el candidato");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">
              {candidate
                ? candidate.first_name + " " + candidate.last_name
                : "Candidato"}
            </h2>
            Volver al <Link to="/sistema/candidatos">listado de candidatos</Link>
          </div>
          <div>
            {isReadonly && (
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={makeCandidateEditable}
                >
                  Modificar candidato
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={removeCandidate}
                >
                  Eliminar candidato
                </button>
              </div>
            )}
          </div>
        </div>
        <hr />
        {candidate && (
          <CandidateForm
            onSubmit={onSubmit}
            discardChanges={discardChanges}
            candidate={candidate}
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

export default ShowCandidate;
