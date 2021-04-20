const { Fiscal } = require("../models");
const { decrypt } = require("../utils/security");
const InvalidTokenException = require("../exceptions/InvalidTokenException");
const UnauthenticatedException = require("../exceptions/UnauthenticatedException");

async function authFiscal(req, res, next) {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      throw new UnauthenticatedException();
    }

    const token = authorization.split("Bearer")[1].trim();

    if (!token) {
      throw new UnauthenticatedException();
    }

    const decodedToken = Buffer.from(token, "base64").toString();
    const decryptedToken = decrypt(decodedToken);

    const fiscal = await Fiscal.findOne({
      where: {
        token: decryptedToken,
      },
    });

    if (!fiscal) {
      throw new InvalidTokenException();
    }

    req.fiscal = fiscal;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authFiscal;
