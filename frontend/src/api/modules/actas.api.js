import apiClient from "api/apiClient";

import imageBlobReduce from "image-blob-reduce";

let _reducer;

const reducer = () => {
  if(!_reducer) {
    _reducer = imageBlobReduce();
  }
  return _reducer;
}

export const getActas = (params) => apiClient.get("actas", { params });
export const getActa = (id) => apiClient.get(`actas/${id}`);
export const getActaTemplate = (distrito, seccion_electoral) => apiClient.get(`actas/template`, {
  params: {
    distrito,
    seccion_electoral
  }
});
export const deleteActa = (id) => apiClient.delete(`actas/${id}`);

const serializeActa = async function (data) {
  const formData = new FormData();
  const {foto, ...rest} = data;
  if (foto && foto instanceof FileList) {
    formData.append('foto', await reducer().toBlob(foto[0], { max: 1200 }));
  }
  formData.append('json', JSON.stringify(rest))
  return formData;
};

export const postActa = async (data) => {
  const formData = await serializeActa(data);
  return apiClient.post(`actas`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

}

export const putActa = async (id, data) => {
  const formData = await serializeActa(data);
  return apiClient.put(`actas/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

