function InvalidEmailSettingsException() {
  this.message = "La configuración del servidor SMTP es incorrecta.";
  this.name = "ApplicationException";
  this.code = "INVALID_EMAIL_SETTINGS";
  this.statusCode = 1;
}

module.exports = InvalidEmailSettingsException;
