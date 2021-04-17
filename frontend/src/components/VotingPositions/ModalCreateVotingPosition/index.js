import React, { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import { searchPositions } from "api/modules/positions.api";
import { postVotingPositions } from "api/modules/votings.api";
import Modal from "components/Modal";
import AgnosticAutocompleteField from "components/Forms/AgnosticAutocompleteField";

const ModalCreateVotingPosition = ({
  votingId,
  closeModal,
  positions,
  onPostulate,
}) => {
  const [postulating, setPostulating] = useState({
    errors: null,
    loading: false,
  });

  const [selectedPositions, setSelectedPositions] = useState([]);

  const isPositionSelected = (position) => {
    const isInVoting = positions.some(({ id }) => position.id === Number(id));
    const isInList = selectedPositions.some(({ id }) => position.id === id);
    return isInVoting || isInList;
  };

  const hasPositions = selectedPositions && selectedPositions.length > 0;

  const selectPosition = (position) => {
    if (isPositionSelected(position)) {
      return false;
    }

    setSelectedPositions((positions) => [...positions, position]);
  };

  const unselectPosition = (position) => {
    if (!isPositionSelected(position)) {
      return false;
    }

    setSelectedPositions((positions) =>
      positions.filter(({ id }) => position.id !== id)
    );
  };

  const postulate = async () => {
    setPostulating((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const positionIds = selectedPositions.map(({ id }) => id);
      await postVotingPositions(votingId, positionIds);
      toast.info("Las posiciones se han vinculado exitosamente");
      onPostulate();
    } catch (error) {
      setPostulating((prev) => ({
        ...prev,
        errors: error?.response?.data?.errors || [error],
      }));
      toast.error("Ha ocurrido un error al vincular las posiciones");
    } finally {
      setPostulating((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const ResultComponent = ({ result }) => (
    <>
      {result.name} - Tipo: {result.type} - Jurisdicción: {result.jurisdiction}
    </>
  );

  const SelectedPositionComponent = ({ position }) => {
    return (
      <div className="d-flex align-items-center justify-content-between mb-2">
        {position.name} - Tipo: {position.type} - Jurisdicción:{" "}
        {position.jurisdiction}
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => unselectPosition(position)}
        >
          Quitar
        </button>
      </div>
    );
  };

  const ModalFooter = () => (
    <div className="d-flex flex-grow-1 justify-content-between flex-row-reverse">
      <button
        className="btn btn-sm btn-primary"
        disabled={!hasPositions || postulating.loading}
        onClick={postulate}
      >
        Vincular posiciones
      </button>
      <button
        className="btn btn-sm btn-outline-default"
        disabled={postulating.loading}
        onClick={closeModal}
      >
        Cancelar
      </button>
    </div>
  );

  return (
    <Modal
      title="Vincular posiciones"
      size="lg"
      closeModal={closeModal}
      ModalFooter={ModalFooter}
      show
    >
      <AgnosticAutocompleteField
        name="term"
        label="Buscar posiciones"
        searchFn={searchPositions}
        isResultSelected={isPositionSelected}
        selectResult={selectPosition}
        ResultComponent={ResultComponent}
      />

      {selectedPositions && selectedPositions.length > 0 && (
        <div>
          <p>Posiciones seleccionadas</p>
          {selectedPositions.map((position) => (
            <SelectedPositionComponent position={position} key={position.id} />
          ))}
        </div>
      )}
    </Modal>
  );
};

ModalCreateVotingPosition.propTypes = {
  votingId: PropTypes.any.isRequired,
  closeModal: PropTypes.func.isRequired,
  positions: PropTypes.array,
  onPostulate: PropTypes.func.isRequired,
};

ModalCreateVotingPosition.defaultProps = {
  positions: [],
};

export default ModalCreateVotingPosition;
