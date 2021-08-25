import apiClient from "api/apiClient";

export const getActas = () => apiClient.get("actas/fiscal");
export const getActaTemplate = () => apiClient.get("actas/fiscal/template");

const serializeActa = function (data) {
  const formData = new FormData();
  const {foto, ...rest} = data;
  if (foto && foto instanceof FileList) {
    formData.append('foto', foto[0]);
  }
  formData.append('json', JSON.stringify(rest))
  return formData;
};

export const postActa = (data) => {
  const formData = serializeActa(data);
  return apiClient.post(`actas/fiscal`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

}

export const putActa = (id, data) => {
  const formData = serializeActa(data);
  return apiClient.put(`actas/fiscal/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}


