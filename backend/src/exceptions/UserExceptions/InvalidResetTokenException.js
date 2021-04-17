function InvalidResetTokenException() {
  this.message = `El token de verificación es inválido o ya ha sido utilizado`;
  this.name = "UserException";
  this.code = "INVALID_RESET_TOKEN";
  this.statusCode = 400;
  this.isUnidosException = true;
  this.errors = {};
}

module.exports = InvalidResetTokenException;
