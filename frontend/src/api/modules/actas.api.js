import apiClient from "api/apiClient";

export const getActas = (params) => apiClient.get("actas", { params });
export const getActa = (id) => apiClient.get(`actas/${id}`);
export const deleteActa = (id) => apiClient.delete(`actas/${id}`);

export const postActa = (data) => {
  const formData = new FormData();
  const { foto, ...rest } = data;
  formData.append('foto', foto[0]);
  formData.append('json', JSON.stringify(rest))
  return apiClient.post(`actas`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

}

export const putActa = (id, data) => {
  const formData = new FormData();
  const {foto, ...rest} = data;
  if (foto && foto instanceof FileList) {
    formData.append('foto', foto[0]);
  }
  formData.append('json', JSON.stringify(rest))
  return apiClient.put(`actas/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

