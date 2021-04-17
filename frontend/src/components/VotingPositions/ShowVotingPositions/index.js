/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getVotingPositions,
  deleteVotingPosition,
} from "api/modules/votings.api";
import Spinner from "components/Spinner";
import ErrorDisplay from "components/ErrorDisplay";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ModalCreateVotingPosition from "../ModalCreateVotingPosition";

const ShowVotingPosition = ({ voting }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [votingPositions, setVotingPositions] = useState([]);

  const [isApplying, setApplying] = useState(false);

  const createVotingPositions = () => {
    setApplying(true);
  };

  const closeModal = () => {
    setApplying(false);
  };

  const invokeFetchVotingPositions = () => {
    fetchVotingPositions();
  };

  useEffect(invokeFetchVotingPositions, []);

  const fetchVotingPositions = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const { data } = await getVotingPositions(voting.id);
      setVotingPositions(data);
    } catch (error) {
      setFetchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeVotingPosition = async (votingPosition) => {
    if (
      confirm(
        `¿Deseas eliminar la posición ${votingPosition.position.name} de la votación ${voting.name}?`
      )
    ) {
      try {
        await deleteVotingPosition(voting.id, votingPosition.id);
        toast.info(
          `La posición ${votingPosition.position.name} de la votación ${voting.name} ha sido eliminada exitosamente`
        );
        fetchVotingPositions();
      } catch (error) {
        toast.error(
          `Ha ocurrido un error al eliminar la posición ${votingPosition.position.name}`
        );
      }
    }
  };

  const onPostulate = () => {
    closeModal();
    fetchVotingPositions();
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
          </ErrorDisplay>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <div className="h5 m-0">Posiciones que se votarán</div>
        <div className="btn-group">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={fetchVotingPositions}
          >
            Actualizar listado
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={createVotingPositions}
          >
            Vincular posición
          </button>
        </div>
      </div>
      <div className="card">
        <div className="table-responsive">
          <table className="table table-flush align-items-center">
            <thead>
              <tr>
                <th scope="col" style={{ width: 50 }}>
                  #
                </th>
                <th scope="col">Nombre</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {votingPositions.map((vp, index) => (
                <tr key={vp.id}>
                  <td>{index + 1}</td>
                  <td>{vp.position.name}</td>
                  <td className="text-right">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeVotingPosition(vp)}
                      >
                        Eliminar
                      </button>
                      <Link
                        className="btn btn-outline-secondary btn-sm"
                        to={`/sistema/votaciones/${voting.id}/posiciones/${vp.id}`}
                      >
                        Ver candidatos
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isApplying && (
        <ModalCreateVotingPosition
          votingId={voting.id}
          closeModal={closeModal}
          positions={votingPositions}
          onPostulate={onPostulate}
        />
      )}
    </>
  );
};

ShowVotingPosition.propTypes = {
  voting: PropTypes.object.isRequired,
};

export default ShowVotingPosition;
