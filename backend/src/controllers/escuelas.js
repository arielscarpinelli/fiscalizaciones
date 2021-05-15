const Joi = require("joi");
const { Escuela, Partido, User, Fiscal, Mesa } = require("../models");
const { Op, fn, col } = require("sequelize");


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

    const queries = [];

    const partido = User.getPartido(req.user) || req.query.partido;

    if (partido) {
      queries.push({
        partido
      })
    }

    const distrito = User.getDistrito(req.user) || req.query.distrito;

    if (distrito) {
      queries.push({
        distrito
      })
    }

    const seccion_electoral = User.getSeccionElectoral(req.user) || req.query.seccion;

    if (seccion_electoral) {
      queries.push({
        seccion_electoral
      })
    }


    if (req.query.q) {
      queries.push({
        [Op.or]: {
          nombre: {
            [Op.like]: `%${req.query.q}%`,
          },
          codigo: req.query.q
        }
      });
    }

    const escuelas = await Escuela.findAll({
      attributes: {
        include: [
          [fn('COUNT', fn('DISTINCT', col('Fiscales.id'))), 'fiscales_count'],
          [fn('COUNT', fn('DISTINCT', col('Mesas.id'))), 'mesas_count']
        ]
      },
      include: [{
        model: Partido,
        as: 'partido_'
      }, {
        model: Fiscal,
        attributes: [], // el join es solo para el count
      }, {
        model: Mesa,
        attributes: [], // el join es solo para el count
      }],
      limit: 50,
      offset: req.query.page ? Number(req.query.page) * 50 : undefined,
      where: {
        [Op.and]: queries,
      },
      group: ['Escuela.id'],
      subQuery: false
    });
    res.json(escuelas);
  } catch (error) {
    next(error);
  }
};

const getEscuela = async (req, res, next) => {
  try {
    const { id } = req.params;

    const escuela = await Escuela.findByPk(id, {
      include: {
        model: Partido,
        as: 'partido_'
      }
    });
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
