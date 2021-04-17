function InvalidTokenException(
  message = "La sesión ha expirado. Inicia nuevamente"
) {
  this.message = message;
  this.name = "AfiliadoException";
  this.code = "AFILIADO_SESSION_EXPIRED";
  this.statusCode = 401;
  this.isUnidosException = true;
  this.errors = {};
}

module.exports = InvalidTokenException;
