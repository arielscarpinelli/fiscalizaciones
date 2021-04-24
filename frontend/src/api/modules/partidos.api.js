import apiClient from "api/apiClient";

export const getPartidos = () => apiClient.get("partidos");
export const postPartido = (data) => apiClient.post(`partidos`, data);
export const getPartido = (id) => apiClient.get(`partidos/${id}`);
export const putPartido = (id, data) =>
  apiClient.put(`partidos/${id}`, data);
export const deletePartido = (id) => apiClient.delete(`partidos/${id}`);
