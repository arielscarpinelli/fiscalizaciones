const Joi = require("joi");
const { Partido } = require("../models");

const AccessForbiddenException = require("../exceptions/UserExceptions/AccessForbiddenException");

const validation = Joi.object({
  name: Joi.string().trim().required(),
});

const getPartidos = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("listar partidos");
    }

    const partidos = await Partido.findAll();
    res.json(partidos);
  } catch (error) {
    next(error);
  }
};

const getPartido = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("listar partidos");
    }

    const partido = await Partido.findByPk(id);
    if (!partido) {
      return next();
    }
    res.json(partido);
  } catch (error) {
    next(error);
  }
};

const postPartido = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("crear partidos");
    }

    const data = await validation.validateAsync(req.body);

    const partido = await Partido.create(data);

    res.json(partido);
  } catch (error) {
    next(error);
  }
};

const putPartido = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("crear partidos");
    }

    const { id } = req.params;

    const data = await validation.validateAsync(req.body);
    const partido = await Partido.findByPk(id);

    if (!partido) {
      return next();
    }

    await Partido.update(data, {
      where: {
        id,
      },
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

const deletePartido = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("eliminar partidos");
    }

    const { id } = req.params;

    const partido = await Partido.findByPk(id);
    if (!partido) {
      return next();
    }

    await partido.destroy();

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getPartidos,
  getPartido,
  postPartido,
  putPartido,
  deletePartido,
};
