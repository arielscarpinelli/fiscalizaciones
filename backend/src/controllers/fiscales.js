
const Joi = require("joi");

const {
  Fiscal,
  Partido,
  User,
  Escuela,
} = require("../models");

const { Op } = require("sequelize");

const AccessForbiddenException = require("../exceptions/UserExceptions/AccessForbiddenException");

const searchValidation = require("../utils/searchValidation");


const validation = (user, payload) => {
  let schema = {
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim().required(),
    dni: Joi.number().required(),
    email: Joi.string().email({tlds: {allow: false}}).required(),
    phone: Joi.number().empty('').optional(),
    address: Joi.string().trim().optional(),
    distrito: Joi.number().required().custom((distrito) => {
      // Si es un admin de distrito, solo puede crear/editar fiscales de ese distrito
      const userDistrito = User.getDistrito(user);
      if (userDistrito && (userDistrito !== distrito)) {
        throw new Error("solo puede crear fiscales de su distrito");
      }
      return distrito;
    }),
    seccion_electoral: Joi.number().required().custom((seccion) => {
      // Si es un admin de municipio, solo puede crear/editar fiscales de ese municipio
      const userSeccion = User.getSeccionElectoral(user);
      if (userSeccion && (userSeccion !== seccion)) {
        throw new Error("solo puede crear fiscales de su municipio");
      }
      return seccion;
    }),
    partido: Joi.number().required().custom((partido) => {
      // Si es un admin de partido, solo puede crear/editar fiscales de ese partido
      const userPartido = User.getPartido(user);
      if (userPartido && (userPartido !== partido)) {
        throw new Error("solo puede crear fiscales de su partido");
      }
      return partido;
    }),
    escuela: Joi.number().allow(null).optional().external(async (escuela) => {
      // Si tiene escuela:
      // - que la escuela sea del mismo partido que tiene el fiscal (esto ya valida que sea del mismo partido que del admin)
      // - que la escuela sea del mismo distrito y/o seccion del usuario si aplica
      if (escuela) {
        const model = await Escuela.findByPk(escuela);
        /*
        if (model.partido !== payload.partido) {
          throw new Error("Escuela asignada a otro partido");
        }
        */
        const distrito = User.getDistrito(user);
        if (distrito && (model.distrito !== distrito)) {
          throw new Error("Escuela de otro distrito");
        }

        const seccion = User.getSeccionElectoral(user);
        if (seccion && (model.seccion_electoral !== seccion)) {
          throw new Error("Escuela de otra sección electoral");
        }
      }
    }),
    mesa: Joi.number().allow(null).optional(),
  };


  return Joi.object(schema);
}

const validatePartido = (user, fiscal) => {
  const partido = User.getPartido(user);
  if (partido && partido !== fiscal.partido) {
    throw new AccessForbiddenException("fiscal de otro partido");
  }
}

const validateGeo = async (user, fiscal) => {
  const distrito = User.getDistrito(user);
  if (distrito && fiscal.distrito !== distrito) {
    throw new AccessForbiddenException("fiscal de otro distrito");
  }

  const seccion = User.getSeccionElectoral(user);
  if (seccion && fiscal.seccion_electoral !== seccion) {
    throw new AccessForbiddenException("fiscal de otra sección electoral");
  }

  if (fiscal.escuela && distrito) {
    const escuela = await Escuela.findByPk(fiscal.escuela);
    if (escuela) {
      if ((escuela.distrito !== distrito) || (seccion && (escuela.seccion_electoral !== seccion))) {
        throw new AccessForbiddenException("fiscal asignado a escuela de otro distrito o sección electoral");
      }
    }
  }
}

const searchFiscales = async (req, res, next) => {
  try {

    let results;

    const baseOptions = {
      include: [{
        model: Partido,
        as: 'partido_'
      }, {
        model: Escuela,
        as: 'escuela_'
      }],
      limit: 50,
      offset: req.query.page ? Number(req.query.page) * 50 : undefined,
    }

    const queries = User.applyPrivilegesToQuery(req);

    if (req.query.q) {

      const {q} = await searchValidation.validateAsync(req.query);

      queries.push({
        [Op.or]: {
          first_name: {
            [Op.like]: `%${q}%`,
          },
          last_name: {
            [Op.like]: `%${q}%`,
          },
        },
      });
    }

    const dni = req.query.dni;
    if (dni) {
      queries.push({
        dni
      })
    }

    const escuela = req.query.escuela;

    if (escuela) {
      queries.push({
        escuela
      })
    }

    const mesa = req.query.mesa;

    if (mesa) {
      queries.push({
        mesa: mesa
      })
    }

    results = await Fiscal.findAll({
      ...baseOptions,
      where: {
        [Op.and]: queries,
      },
    });

    res.json(results);
  } catch (error) {
    next(error);
  }
};

const getFiscal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fiscal = await Fiscal.findByPk(id);

    if (!fiscal) {
      return next();
    }

    validatePartido(req.user, fiscal);

    const {code, token, ...cleanFiscal} = fiscal.toJSON();

    res.json(cleanFiscal);
  } catch (error) {
    next(error);
  }
};

const postFiscal = async (req, res, next) => {
  try {
    const data = await validation(req.user, req.body).validateAsync(req.body);
    const fiscal = await Fiscal.create(data);
    res.status(201).json(fiscal);
  } catch (error) {
    next(error);
  }
};

const putFiscal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await validation(req.user, req.body).validateAsync(req.body);
    const fiscal = await Fiscal.findByPk(id);

    if (!fiscal) {
      return next();
    }

    validatePartido(req.user, fiscal);
    await validateGeo(req.user, fiscal);

    await Fiscal.update(data, {
      where: {
        id,
      },
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

const deleteFiscal = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Fiscal.destroy({
      where: {
        id,
      },
    });
    res.json();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getFiscal,
  postFiscal,
  putFiscal,
  deleteFiscal,
  searchFiscales,
};
