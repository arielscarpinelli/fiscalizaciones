import apiClient from "api/apiClient";

export const getActas = () => apiClient.get("actas/fiscal");
export const getActaDefault = () => apiClient.get("actas/fiscal/default");
export const postActa = (data) => {
  const formData = new FormData();
  const { foto, ...rest } = data;
  formData.append('foto', foto[0]);
  formData.append('json', JSON.stringify(rest))
  return apiClient.post(`actas/fiscal`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

}
