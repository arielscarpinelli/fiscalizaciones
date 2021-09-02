const Joi = require("joi");
const { JoiPasswordComplexity } = require("joi-password");
const { Partido, User } = require("../models");
const { Op } = require("sequelize");
const crypto = require("crypto");

const welcomeUser = require("../helpers/UserHelpers/welcomeUser");
const resetUserPassword = require("../helpers/UserHelpers/resetUserPassword");

const AccessForbiddenException = require("../exceptions/UserExceptions/AccessForbiddenException");
const InvalidResetTokenException = require("../exceptions/UserExceptions/InvalidResetTokenException");
const UserEmailAlreadyExistsException = require("../exceptions/UserExceptions/UserEmailAlreadyExistsException");
const UserInvalidCredentialsException = require("../exceptions/UserExceptions/UserInvalidCredentialsException");
const searchValidation = require("../utils/searchValidation");

const validation = (reqUser) => {
  const adminDistrito = User.getDistrito(reqUser);
  const adminSeccion = User.getSeccionElectoral(reqUser);

  return Joi.object({
    name: Joi.string().trim().optional(),
    email: Joi.string().trim().email().required(),
    role: Joi.string().trim().valid("SUPERADMIN", "ADMIN", "OPERATOR").required(),
    distrito: !adminDistrito ? Joi.number().allow(null).optional() : Joi.number().required().custom((distrito) => {
      // Si es un admin de distrito, solo puede crear/editar usuarios de ese distrito
      if (adminDistrito !== distrito) {
        throw new Error("solo puede crear usuarios de su distrito");
      }
      return distrito;
    }),
    seccion_electoral: !adminSeccion ? Joi.number().allow(null).optional() : Joi.number().required().custom((seccion) => {
      // Si es un admin de municipio, solo puede crear/editar usuarios de ese municipio
      if (adminSeccion !== seccion) {
        throw new Error("solo puede crear usuarios de su municipio");
      }
      return seccion;
    }),
    partido: Joi.number().required().custom((partido) => {
      // Si es un admin de partido, solo puede crear/editar users de ese partido
      const adminPartido = User.getPartido(reqUser);
      if (adminPartido && (adminPartido !== partido)) {
        throw new Error("solo puede crear usuarios de su partido");
      }
      return partido;
    }),
  });
}

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

    const queries = User.applyPrivilegesToQuery(req);

    const name = req.query.name;
    if (name) {
      queries.push({
          name: {
            [Op.like]: `%${name}%`
          }
        })
    }

    const email = req.query.email;
    if (email) {
      queries.push({
        email: {
          [Op.like]: `${email}%`
        }
      })
    }

    const role = req.query.role;
    if (role) {
      queries.push({
        role
      })
    }

    const users = await User.findAll({
      include: {
        model: Partido,
        as: 'partido_'
      },
      where: {
        [Op.and]: queries,
      },
      limit: 50,
      offset: req.query.page ? Number(req.query.page) * 50 : undefined,
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

    const data = await validation(req.user).validateAsync(req.body);

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

    if (user.id === req.user.id) {
      throw new AccessForbiddenException("eliminarse a si mismo");
    }

    if (user.role === "SUPERADMIN" && !isSuperAdmin) {
      throw new AccessForbiddenException("eliminar a superadmin");
    }

    if (isAdmin && user.role === "ADMIN") {
      throw new AccessForbiddenException("eliminar a otro admin");
    }

    const adminDistrito = User.getDistrito(req.user);

    if (adminDistrito && adminDistrito !== user.distrito) {
      throw new AccessForbiddenException("eliminar usuarios de su distrito");
    }

    const adminSeccion = User.getSeccionElectoral(req.user);
    if (adminSeccion && adminSeccion !== user.seccion_electoral) {
      throw new AccessForbiddenException("eliminar usuarios de su municipio");
    }

    const adminPartido = User.getPartido(req.user);
    if (adminPartido && (adminPartido !== user.partido)) {
      throw new Error("eliminar usuarios de su partido");
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
