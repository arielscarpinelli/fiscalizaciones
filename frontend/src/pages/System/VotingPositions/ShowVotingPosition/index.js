/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteVotingPositionCandidate,
  getVotingPosition,
} from "api/modules/votings.api";

import Spinner from "components/Spinner";
import ErrorDisplay from "components/ErrorDisplay";
import ModalPostulateCandidate from "components/Candidates/ModalPostulateCandidate";
import CandidateBasicPresentation from "components/Candidates/BasicPresentation";

const ShowVoting = () => {
  const { id, votingPositionId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [votingPosition, setVotingPosition] = useState(null);

  const [isApplying, setApplying] = useState(false);

  const addCandidateToVotingPosition = () => {
    setApplying(true);
  };

  const closeModal = () => {
    setApplying(false);
  };

  const invokeFetchVoting = () => {
    fetchVotingByParamId();
  };

  useEffect(invokeFetchVoting, []);

  const fetchVotingByParamId = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await getVotingPosition(id, votingPositionId);
      setVotingPosition(response.data);
    } catch (error) {
      setVotingPosition(null);
      setFetchError("No existe una votación con ese identificador");
      toast.error("No existe una votación con ese identificador");
    } finally {
      setIsLoading(false);
    }
  };

  const removeVotingPositionCandidate = async (candidate) => {
    if (
      confirm(
        `¿Deseas eliminar la postulación a ${votingPosition.position.name} del candidato ${candidate.first_name} ${candidate.last_name}?`
      )
    ) {
      try {
        await deleteVotingPositionCandidate(
          id,
          votingPositionId,
          candidate.VotingPositionCandidate.id
        );
        toast.info(
          `La postulación del candidato ${candidate.first_name} ${candidate.last_name} ha sido eliminada exitosamente`
        );
        fetchVotingByParamId();
      } catch (error) {
        toast.error(
          `Ha ocurrido un error al eliminar la postulación del candidato ${candidate.first_name} ${candidate.last_name}`
        );
      }
    }
  };

  const onPostulate = () => {
    closeModal();
    fetchVotingByParamId();
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
    <>
      <div className="row mb-4">
        <div className="col-lg-10 col-xl-8 mx-auto">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="m-0">
                Candidatos para {votingPosition.position.name}
              </h2>
              <h5 className="m-0 mb-2 text-muted">
                {votingPosition.voting.name}
              </h5>
              Volver a{" "}
              <Link to={`/sistema/votaciones/${votingPosition.voting.id}`}>
                la votación
              </Link>
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={addCandidateToVotingPosition}
              >
                Postular candidatos
              </button>
            </div>
          </div>
          <hr />
          <div className="card">
            <div className="card-header">Listado de candidatos</div>
            <div className="table-responsive">
              <table className="table table-flush align-items-center">
                <thead>
                  <tr>
                    <th scope="col">Apellido y nombre</th>
                    <th scope="col">Tipo y Número de Documento</th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {votingPosition.candidates.map((candidate) => (
                    <tr key={candidate.VotingPositionCandidate.id}>
                      <td>
                        <CandidateBasicPresentation candidate={candidate} />
                      </td>
                      <td>
                        {candidate.type_id} {candidate.number_id}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() =>
                              removeVotingPositionCandidate(candidate)
                            }
                          >
                            Desvincular
                          </button>
                          <Link
                            className="btn btn-outline-secondary btn-sm"
                            to={`/sistema/candidatos/${candidate.id}`}
                          >
                            Ver
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isApplying && (
        <ModalPostulateCandidate
          votingId={id}
          votingPositionId={votingPositionId}
          closeModal={closeModal}
          candidates={votingPosition.candidates}
          onPostulate={onPostulate}
        />
      )}
    </>
  );
};

export default ShowVoting;
