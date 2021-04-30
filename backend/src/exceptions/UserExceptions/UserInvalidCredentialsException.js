function UserInvalidCredentialsException() {
  this.message = `Credenciales inválidas`;
  this.name = "UserException";
  this.code = "USER_INVALID_CREDENTIALS";
  this.statusCode = 401;
  this.isUnidosException = true;
  this.errors = {
    password: "Revisá las credenciales ingresadas"
  };
}

module.exports = UserInvalidCredentialsException;
