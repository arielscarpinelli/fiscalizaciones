import apiClient from "api/apiClient";

export const getMesas = (escuela) => apiClient.get("mesas", { params: { escuela }});
export const postMesa = (data) => apiClient.post(`mesas`, data);
export const getMesa = (id) => apiClient.get(`mesas/${id}`);
export const putMesa = (id, data) =>
  apiClient.put(`mesas/${id}`, data);
export const deleteMesa = (id) => apiClient.delete(`mesas/${id}`);
