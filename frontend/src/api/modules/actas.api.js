import apiClient from "api/apiClient";

export const getActas = (params) => apiClient.get("actas", { params });
export const getActa = (id) => apiClient.get(`actas/${id}`);
export const getActaTemplate = (distrito, seccion_electoral) => apiClient.get(`actas/template`, {
  params: {
    distrito,
    seccion_electoral
  }
});
export const deleteActa = (id) => apiClient.delete(`actas/${id}`);

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
  return apiClient.post(`actas`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

}

export const putActa = (id, data) => {
  const formData = serializeActa(data);
  return apiClient.put(`actas/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

