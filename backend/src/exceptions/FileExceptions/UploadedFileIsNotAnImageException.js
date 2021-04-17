function UploadedFileIsNotAnImageException() {
  this.message = "Solo se permiten imagenes de tipo png o jpg.";
  this.name = "FileException";
  this.code = "UPLOADED_FILE_IS_NOT_AN_IMAGE";
  this.statusCode = 422;
  this.isUnidosException = true;
}

module.exports = UploadedFileIsNotAnImageException;
