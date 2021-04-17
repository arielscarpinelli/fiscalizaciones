/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getVoting, putVoting, deleteVoting } from "api/modules/votings.api";

import VotingForm from "components/Votings/VotingForm";
import ShowVotingPosition from "components/VotingPositions/ShowVotingPositions";
import Spinner from "components/Spinner";
import ErrorDisplay from "components/ErrorDisplay";

const ShowVoting = () => {
  const { id } = useParams();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [voting, setVoting] = useState(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const invokeFetchVoting = () => {
    fetchVotingByParamId();
  };

  useEffect(invokeFetchVoting, []);

  const makeVotingEditable = () => {
    setIsReadonly(false);
  };

  const discardChanges = () => {
    setIsReadonly(true);
  };

  const fetchVotingByParamId = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await getVoting(id);
      setVoting(response.data);
    } catch (error) {
      setVoting(null);
      setFetchError("No existe una votación con ese identificador");
      toast.error("No existe una votación con ese identificador");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await putVoting(id, data);
      setVoting((oldVoting) => {
        return {
          ...oldVoting,
          ...response.data,
        };
      });
      setIsReadonly(true);
      toast.info("La votación ha sido modificada exitosamente");
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al modificar la votación");
      }
    }
  };

  const removeVoting = async () => {
    if (confirm(`¿Deseas eliminar la votación ${voting.name}?`)) {
      try {
        await deleteVoting(id);
        toast.info("La votación ha sido eliminada exitosamente");
        history.push("/sistema/votaciones");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar la votación");
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!isLoading && fetchError) {
    return (
      <div className="row mb-4">
        <div className="col-lg-10 col-xl-8 mx-auto">
          <ErrorDisplay>
            <div>{fetchError}</div>
            Volver al <Link to="/votaciones">listado de votaciones</Link>
          </ErrorDisplay>
        </div>
      </div>
    );
  }

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">{voting ? voting.name : "Votación"}</h2>
            Volver al <Link to="/votaciones">listado de votaciones</Link>
          </div>
          <div>
            {isReadonly && (
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={removeVoting}
                >
                  Eliminar votación
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={makeVotingEditable}
                >
                  Modificar votación
                </button>
              </div>
            )}
          </div>
        </div>
        <hr />
        <VotingForm
          onSubmit={onSubmit}
          discardChanges={discardChanges}
          voting={voting}
          isReadonly={isReadonly}
          isSubmitting={isSubmitting}
          errors={hasErrors}
          fromEdit
        />
        {isReadonly && <ShowVotingPosition voting={voting} />}
      </div>
    </div>
  );
};

export default ShowVoting;
