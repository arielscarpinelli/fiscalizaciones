const {Op} = require("sequelize");

const Joi = require("joi");
const { Mesa, Escuela } = require("../models");

const AccessForbiddenException = require("../exceptions/UserExceptions/AccessForbiddenException");

const validation = Joi.object({
  codigo: Joi.number().required(),
  electores_masculinos: Joi.number().required(),
  electores_femeninos: Joi.number().required(),
  escuela: Joi.number().required(),
});

const getMesas = async (req, res, next) => {
  try {

    const queries = [];

    if (req.query.escuela) {
      queries.push({escuela: req.query.escuela});
    }

    if (req.query.codigo) {
      queries.push({codigo: req.query.codigo});
    }

    const mesas = await Mesa.findAll({
      include: {
        model: Escuela,
        as: 'escuela_'
      },
      where: {
        [Op.and]: queries,
      },
      limit: 50,
      offset: req.query.page ? Number(req.query.page) * 50 : undefined,
    });
    res.json(mesas);
  } catch (error) {
    next(error);
  }
};

const getMesa = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("listar mesas");
    }

    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      return next();
    }
    res.json(mesa);
  } catch (error) {
    next(error);
  }
};

const postMesa = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("crear mesas");
    }

    const data = await validation.validateAsync(req.body);

    const mesa = await Mesa.create(data);

    res.json(mesa);
  } catch (error) {
    next(error);
  }
};

const putMesa = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("crear mesas");
    }

    const { id } = req.params;

    const data = await validation.validateAsync(req.body);
    const mesa = await Mesa.findByPk(id);

    if (!mesa) {
      return next();
    }

    await Mesa.update(data, {
      where: {
        id,
      },
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

const deleteMesa = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new AccessForbiddenException("eliminar mesas");
    }

    const { id } = req.params;

    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      return next();
    }

    await mesa.destroy();

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getMesas,
  getMesa,
  postMesa,
  putMesa,
  deleteMesa,
};
