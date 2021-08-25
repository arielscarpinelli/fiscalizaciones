import apiClient from "api/apiClient";
import imageBlobReduce from "image-blob-reduce";

export const getActas = () => apiClient.get("actas/fiscal");
export const getActaTemplate = () => apiClient.get("actas/fiscal/template");

let _reducer;

const reducer = () => {
  if(!_reducer) {
    _reducer = imageBlobReduce();
  }
  return _reducer;
}

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
  return apiClient.post(`actas/fiscal`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

}

export const putActa = async (id, data) => {
  const formData = await serializeActa(data);
  return apiClient.put(`actas/fiscal/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}


