import apiClient from "api/apiClient";

import imageResize from "utils/imageResize";

export const getActas = () => apiClient.get("actas/fiscal");
export const getActaTemplate = () => apiClient.get("actas/fiscal/template");

const serializeActa = async function (data) {
  const formData = new FormData();
  const {foto, foto2, ...rest} = data;
  if (foto && foto instanceof FileList) {
    formData.append('foto', await imageResize(foto[0], { max: 1200 }));
  }
  if (foto2 && foto2 instanceof FileList) {
    formData.append('foto2', await imageResize(foto2[0], { max: 1200 }));
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


