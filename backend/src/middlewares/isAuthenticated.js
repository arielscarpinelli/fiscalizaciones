const jwt = require("jsonwebtoken");
const { SESSION_SECRET } = require("../config");
const { User } = require("../models");

const SessionExpiredException = require("../exceptions/UserExceptions/SessionExpiredException");

const authenticateToken = (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return next(new SessionExpiredException());
  }

  jwt.verify(token, SESSION_SECRET, async (err, user) => {
    if (err) {
      return next(new SessionExpiredException());
    }

    const model = await User.findByPk(user.id);

    if (!model) {
      return next(new SessionExpiredException());
    }

    const realUser = model.get();
    req.user = realUser;
    next(); // pass the execution off to whatever request the client intended
  });
};

module.exports = authenticateToken;
