function ValidationException(message, field) {
  this.message = message;
  this.statusCode = 422;
  this.isUnidosException = true;
  this.errors = {
    [field]: message,
  };
}

module.exports = ValidationException;
