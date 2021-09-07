const Joi = require("joi");
const { Escuela, Partido, User, Fiscal, Mesa } = require("../models");
const { Op, fn, col, literal } = require("sequelize");


const AccessForbiddenException = require("../exceptions/UserExceptions/AccessForbiddenException");

const validation = Joi.object({
  codigo: Joi.number().required(),
  nombre: Joi.string().trim().required(),
  direccion: Joi.string().trim().required(),
  localidad: Joi.string().empty("").trim().optional(),
  distrito: Joi.number().required(),
  seccion_electoral: Joi.number().required(),
  circuito: Joi.string().trim(),
  partido: Joi.number().required(),
});

const getEscuelas = async (req, res, next) => {
  try {

    const queries = User.applyPrivilegesToQuery(req, true);

    if (req.query.q) {
      queries.push({
        [Op.or]: [{
          nombre: {
            [Op.like]: `%${req.query.q}%`,
          }
        }, {
          codigo: req.query.q
        }]
      });
    }

    if (req.query.direccion) {
      queries.push({
        direccion: {
          [Op.like]: `%${req.query.direccion}%`,
        },
      });
    }

    if (req.query.localidad) {
      queries.push({
        localidad: {
          [Op.like]: `%${req.query.localidad}%`,
        },
      });
    }

    if (req.query.codigo) {
      queries.push({
        codigo: req.query.codigo
      });
    }

    if (req.query.partido) {
      queries.push({
        partido: req.query.partido
      });
    }

    if (req.query.circuito) {
      queries.push({
        circuito: req.query.circuito
      });
    }

    if (req.query.prioridad) {
      queries.push({
        prioridad: req.query.prioridad
      });
    }

    let having;

    if (req.query.fiscales) {
      having = literal('fiscales_count ' + req.query.fiscales)
    }

    const escuelas = await Escuela.findAll({
      attributes: {
        include: [
          [literal('(SELECT COUNT(1) FROM Fiscales WHERE escuela = Escuela.id)'), 'fiscales_count'],
        ]
      },
      include: [{
        model: Partido,
        as: 'partido_'
      }],
      limit: 50,
      offset: req.query.page ? Number(req.query.page) * 50 : undefined,
      where: {
        [Op.and]: queries,
      },
      order: [fn('isnull', col('prioridad')), 'prioridad'],
      having
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
