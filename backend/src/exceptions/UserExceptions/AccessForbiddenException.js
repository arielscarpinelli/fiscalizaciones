function AccessForbiddenException(action, errors = {}, code = 403) {
  this.message = `No tienes autorización para ${action}`;
  this.name = "UserException";
  this.code = "ACCESS_FORBBIDEN";
  this.statusCode = code;
  this.isUnidosException = true;
  this.errors = errors;
}

module.exports = AccessForbiddenException;
