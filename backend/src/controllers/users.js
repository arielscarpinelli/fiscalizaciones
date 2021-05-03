const Joi = require("joi");
const { JoiPasswordComplexity } = require("joi-password");
const { Partido, User } = require("../models");
const crypto = require("crypto");
const welcomeUser = require("../helpers/UserHelpers/welcomeUser");
const resetUserPassword = require("../helpers/UserHelpers/resetUserPassword");

const AccessForbiddenException = require("../exceptions/UserExceptions/AccessForbiddenException");
const InvalidResetTokenException = require("../exceptions/UserExceptions/InvalidResetTokenException");
const UserEmailAlreadyExistsException = require("../exceptions/UserExceptions/UserEmailAlreadyExistsException");
const UserInvalidCredentialsException = require("../exceptions/UserExceptions/UserInvalidCredentialsException");

const validation = Joi.object({
  email: Joi.string().trim().email().required(),
  role: Joi.string().trim().valid("SUPERADMIN", "ADMIN", "OPERATOR").required(),
  distrito: Joi.any(),
  seccion_electoral: Joi.number(),
  partido: Joi.number()
});

const resetPasswordValidation = Joi.object({
  password: JoiPasswordComplexity.string()
      .trim()
      .min(8)
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .required(),
  confirmPassword: Joi.string().trim().required().equal(Joi.ref("password")),
  token: Joi.string().trim().required(),
});

const loginValidation = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required(),
});

const forgotPasswordValidation = Joi.object({
  email: Joi.string().trim().email().required(),
});

const getUsers = async (req, res, next) => {
  try {
    if (req.user.role === "OPERATOR") {
      throw new AccessForbiddenException("listar usuarios");
    }

    const users = await User.findAll({
      include: {
        model: Partido,
        as: 'partido_'
      },
      limit: 50,
      offset: req.page,
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role === "OPERATOR") {
      throw new AccessForbiddenException("listar usuarios");
    }

    const user = await User.findByPk(id);
    if (!user) {
      return next();
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN" && req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("crear usuarios");
    }

    const data = await validation.validateAsync(req.body);

    const userExists = await User.findOne({
      where: { email: data.email },
    });

    if (userExists) {
      throw new UserEmailAlreadyExistsException();
    }

    const user = await User.create({
      ...data,
      password: crypto.randomBytes(32).toString("hex"),
    });

    await welcomeUser(user);

    res.status(201).json();
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "ADMIN";
    const isSuperAdmin = req.user.role === "SUPERADMIN";

    if (!isAdmin && !isSuperAdmin) {
      throw new AccessForbiddenException("eliminar usuarios");
    }

    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return next();
    }

    if (user.role === "SUPERADMIN") {
      throw new AccessForbiddenException("eliminar a otro superadmin");
    }

    if (isAdmin && user.role === "ADMIN") {
      throw new AccessForbiddenException("eliminar a otro admin");
    }

    await user.destroy();

    res.json();
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const data = await forgotPasswordValidation.validateAsync(req.body);

    const user = await User.findOne({
      where: { email: data.email },
    });

    // fail silently
    if (user) {
      await resetUserPassword(user);
    }

    res.json();
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const data = await resetPasswordValidation.validateAsync(req.body);

    const user = await User.findOne({
      where: { resetToken: data.token },
    });

    if (!user) {
      throw new InvalidResetTokenException();
    }

    user.password = data.password;
    user.generateResetToken();

    res.json();
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const data = await loginValidation.validateAsync(req.body);

    const user = await User.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new UserInvalidCredentialsException();
    }

    const isPasswordValid = user.checkPassword(data.password);

    if (!isPasswordValid) {
      throw new UserInvalidCredentialsException();
    }

    const authResponse = user.toAuthJSON();

    res.json(authResponse);
  } catch (error) {
    next(error);
  }
};

const checkTokenValidity = async (req, res, next) => {
  res.json();
};

module.exports = {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  loginUser,
  checkTokenValidity,
};
