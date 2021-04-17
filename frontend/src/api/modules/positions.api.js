import apiClient from "api/apiClient";

export const getPositions = () => apiClient.get("positions");
export const postPosition = (data) => apiClient.post(`positions`, data);
export const getPosition = (id) => apiClient.get(`positions/${id}`);
export const putPosition = (id, data) => apiClient.put(`positions/${id}`, data);
export const deletePosition = (id) => apiClient.delete(`positions/${id}`);

export const searchPositions = (term) =>
  apiClient.get("positions/search", {
    params: {
      term,
    },
  });
