function InvalidValidationCodeException() {
  this.message = "El código de validación ingresado no es correcto";
  this.name = "AfiliadoException";
  this.code = "INVALID_VALIDATION_CODE";
  this.statusCode = 400;
  this.isUnidosException = true;
  this.errors = {
    code: "El código de validación ingresado no es correcto",
  };
}

module.exports = InvalidValidationCodeException;
