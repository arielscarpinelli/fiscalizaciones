import apiClient from "api/apiClient";

export const getVotings = () => apiClient.get("votings");
export const postVoting = (data) => apiClient.post(`votings`, data);
export const getVoting = (id) => apiClient.get(`votings/${id}`);
export const putVoting = (id, data) => apiClient.put(`votings/${id}`, data);
export const deleteVoting = (id) => apiClient.delete(`votings/${id}`);

export const getVotingPositions = (id) =>
  apiClient.get(`votings/${id}/positions`);
export const postVotingPositions = (id, positions) =>
  apiClient.post(`votings/${id}/positions`, {
    positions,
  });
export const getVotingPosition = (id, votingPositionId) =>
  apiClient.get(`votings/${id}/positions/${votingPositionId}`);
export const deleteVotingPosition = (id, votingPositionId) =>
  apiClient.delete(`votings/${id}/positions/${votingPositionId}`);

export const postVotingPositionCandidates = (
  id,
  votingPositionId,
  candidates
) =>
  apiClient.post(`votings/${id}/positions/${votingPositionId}/candidates`, {
    candidates,
  });

export const deleteVotingPositionCandidate = (
  id,
  votingPositionId,
  votingPositionCandidateId
) =>
  apiClient.delete(
    `votings/${id}/positions/${votingPositionId}/candidates/${votingPositionCandidateId}`
  );
