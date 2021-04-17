
function UserDoesntExistException() {
  this.message = `El usuario no existe`;
  this.name = "UserException";
  this.code = "USER_DOESNT_EXIST";
  this.statusCode = 401;
  this.isUnidosException = true;
  this.errors = {};
}

module.exports = UserDoesntExistException;