import apiClient from "api/apiClient";
import { API_URI } from "config";

export const getCandidates = () => apiClient.get("candidates");
export const postCandidate = (data) => apiClient.post(`candidates`, data);
export const getCandidate = (id) => apiClient.get(`candidates/${id}`);
export const getCandidatePhoto = (id) => `${API_URI}candidates/${id}/photo`;
export const putCandidatePhoto = (id, formData) =>
  apiClient.put(`candidates/${id}/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const putCandidate = (id, data) =>
  apiClient.put(`candidates/${id}`, data);
export const deleteCandidate = (id) => apiClient.delete(`candidates/${id}`);

export const searchCandidates = (term) =>
  apiClient.get("candidates/search", {
    params: {
      term,
    },
  });
