function UnauthenticatedException(
  message = "Debes iniciar sesión para realiar esta acción"
) {
  this.message = message;
  this.name = "AfiliadoException";
  this.code = "AFILIADO_MUST_LOGIN";
  this.statusCode = 401;
  this.isUnidosException = true;
  this.errors = {};
}

module.exports = UnauthenticatedException;
