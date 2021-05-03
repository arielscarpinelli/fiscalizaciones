const Joi = require("joi");
const { Escuela, Partido } = require("../models");

const AccessForbiddenException = require("../exceptions/UserExceptions/AccessForbiddenException");

const validation = Joi.object({
  codigo: Joi.number().required(),
  nombre: Joi.string().trim().required(),
  direccion: Joi.string().trim().required(),
  distrito: Joi.number().required(),
  seccion_electoral: Joi.number().required(),
  circuito: Joi.string().trim(),
  partido: Joi.number().required(),
});

const getEscuelas = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("listar escuelas");
    }

    const escuelas = await Escuela.findAll({
      include: {
        model: Partido,
        as: 'partido_'
      },
      limit: 50,
      offset: req.page,
    });
    res.json(escuelas);
  } catch (error) {
    next(error);
  }
};

const getEscuela = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("listar escuelas");
    }

    const escuela = await Escuela.findByPk(id);
    if (!escuela) {
      return next();
    }
    res.json(escuela);
  } catch (error) {
    next(error);
  }
};

const postEscuela = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("crear escuelas");
    }

    const data = await validation.validateAsync(req.body);

    const escuela = await Escuela.create(data);

    res.json(escuela);
  } catch (error) {
    next(error);
  }
};

const putEscuela = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("crear escuelas");
    }

    const { id } = req.params;

    const data = await validation.validateAsync(req.body);
    const escuela = await Escuela.findByPk(id);

    if (!escuela) {
      return next();
    }

    await Escuela.update(data, {
      where: {
        id,
      },
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

const deleteEscuela = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("eliminar escuelas");
    }

    const { id } = req.params;

    const escuela = await Escuela.findByPk(id);
    if (!escuela) {
      return next();
    }

    await escuela.destroy();

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getEscuelas,
  getEscuela,
  postEscuela,
  putEscuela,
  deleteEscuela,
};
