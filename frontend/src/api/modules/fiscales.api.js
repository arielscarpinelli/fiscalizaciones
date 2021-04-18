import apiClient from "api/apiClient";

export const getFiscales = () => apiClient.get("fiscales");
export const postFiscal = (data) => apiClient.post(`fiscales`, data);
export const getFiscal = (id) => apiClient.get(`fiscales/${id}`);
export const putFiscal = (id, data) =>
  apiClient.put(`fiscales/${id}`, data);
export const deleteFiscal = (id) => apiClient.delete(`fiscales/${id}`);

export const searchFiscales = (q) =>
  apiClient.get("fiscales", {
    params: {
      q,
    },
  });
