function UserEmailAlreadyExistsException() {
  this.message = `El email ya existe`;
  this.name = "UserException";
  this.code = "USER_EMAIL_ALREADY_EXISTS";
  this.statusCode = 422;
  this.isUnidosException = true;
  this.errors = {
    email: "El email ya se encuentra en uso",
  };
}

module.exports = UserEmailAlreadyExistsException;
