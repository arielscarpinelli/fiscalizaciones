function SessionExpiredException() {
  this.message = `La sesión ha expirado`;
  this.name = "UserException";
  this.code = "SESSION_EXPIRED";
  this.statusCode = 401;
  this.isUnidosException = true;
}

module.exports = SessionExpiredException;
