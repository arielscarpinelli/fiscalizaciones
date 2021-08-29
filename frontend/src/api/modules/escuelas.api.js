import apiClient from "api/apiClient";

export const getEscuelas = (params) => apiClient.get("escuelas", {params});
export const postEscuela = (data) => apiClient.post(`escuelas`, data);
export const getEscuela = (id) => apiClient.get(`escuelas/${id}`);
export const putEscuela = (id, data) =>
  apiClient.put(`escuelas/${id}`, data);
export const deleteEscuela = (id) => apiClient.delete(`escuelas/${id}`);

export const searchEscuelas = (q, rest) =>
    apiClient.get("escuelas", {
        params: {
            q,
            ...rest
        },
    });
