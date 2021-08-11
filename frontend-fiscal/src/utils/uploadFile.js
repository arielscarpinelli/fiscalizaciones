const uploadFile = (field, file) => {
  let formData = new FormData();
  formData.append(field, file);

  return formData;
};

export default uploadFile;
