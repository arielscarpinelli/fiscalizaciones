import React, { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import { searchCandidates } from "api/modules/candidates.api";
import { postVotingPositionCandidates } from "api/modules/votings.api";
import Modal from "components/Modal";
import CandidateBasicPresentation from "components/Candidates/BasicPresentation";
import AgnosticAutocompleteField from "components/Forms/AgnosticAutocompleteField";

const ModalPostulateCandidate = ({
  votingId,
  votingPositionId,
  closeModal,
  candidates,
  onPostulate,
}) => {
  const [postulating, setPostulating] = useState({
    errors: null,
    loading: false,
  });

  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const isCandidateSelected = (candidate) => {
    const isInVoting = candidates.some(({ id }) => candidate.id === Number(id));
    const isInList = selectedCandidates.some(({ id }) => candidate.id === id);
    return isInVoting || isInList;
  };

  const hasCandidates = selectedCandidates && selectedCandidates.length > 0;

  const selectCandidate = (candidate) => {
    if (isCandidateSelected(candidate)) {
      return false;
    }

    setSelectedCandidates((candidates) => [...candidates, candidate]);
  };

  const unselectCandidate = (candidate) => {
    if (!isCandidateSelected(candidate)) {
      return false;
    }

    setSelectedCandidates((candidates) =>
      candidates.filter(({ id }) => candidate.id !== id)
    );
  };

  const postulate = async () => {
    setPostulating((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const candidateIds = selectedCandidates.map(({ id }) => id);
      await postVotingPositionCandidates(
        votingId,
        votingPositionId,
        candidateIds
      );
      toast.info(
        "La postulación de los candidatos se ha realizado exitosamente"
      );
      onPostulate();
    } catch (error) {
      setPostulating((prev) => ({
        ...prev,
        errors: error?.response?.data?.errors || [error],
      }));
      toast.error(
        "Ha ocurrido un error al realizar la postulación de los candidatos"
      );
    } finally {
      setPostulating((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const ResultComponent = ({ result }) => (
    <>
      <CandidateBasicPresentation candidate={result} />
    </>
  );

  const SelectedCandidateComponent = ({ candidate }) => {
    return (
      <div className="d-flex align-items-center justify-content-between mb-2">
        <CandidateBasicPresentation candidate={candidate} />
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => unselectCandidate(candidate)}
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
        disabled={!hasCandidates || postulating.loading}
        onClick={postulate}
      >
        Postular candidatos
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
      title="Postular candidatos"
      size="lg"
      closeModal={closeModal}
      ModalFooter={ModalFooter}
      show
    >
      <AgnosticAutocompleteField
        name="term"
        label="Buscar candidatos"
        searchFn={searchCandidates}
        isResultSelected={isCandidateSelected}
        selectResult={selectCandidate}
        ResultComponent={ResultComponent}
      />

      {selectedCandidates && selectedCandidates.length > 0 && (
        <div>
          <p>Candidatos seleccionados</p>
          {selectedCandidates.map((candidate) => (
            <SelectedCandidateComponent
              candidate={candidate}
              key={candidate.id}
            />
          ))}
        </div>
      )}
    </Modal>
  );
};

ModalPostulateCandidate.propTypes = {
  votingId: PropTypes.string.isRequired,
  votingPositionId: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  candidates: PropTypes.array,
  onPostulate: PropTypes.func.isRequired,
};

ModalPostulateCandidate.defaultProps = {
  candidates: [],
};

export default ModalPostulateCandidate;
