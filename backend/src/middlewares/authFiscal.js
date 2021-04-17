const { Affiliate } = require("../models");
const { decrypt } = require("../utils/security");
const InvalidTokenException = require("../exceptions/InvalidTokenException");
const UnauthenticatedException = require("../exceptions/UnauthenticatedException");

async function authAffiliate(req, res, next) {
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

    const affiliate = await Affiliate.findOne({
      where: {
        token: decryptedToken,
      },
    });

    if (!affiliate) {
      throw new InvalidTokenException();
    }

    req.affiliate = affiliate;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authAffiliate;
