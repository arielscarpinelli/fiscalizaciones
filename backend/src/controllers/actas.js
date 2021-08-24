const Joi = require("joi");

const {
  Acta,
  Eleccion,
  User,
  Fiscal,
  sequelize,
} = require("../models");

const fs = require("fs");

const path = require("path");

const {UPLOAD_PATH} = require("../config");

const readChunk = require("read-chunk");
const imageType = require("image-type");

const UploadedFileIsNotAnImageException = require("../exceptions/FileExceptions/UploadedFileIsNotAnImageException");
const {UniqueConstraintError, Op} = require("sequelize");
const AccessForbiddenException = require("../exceptions/UserExceptions/AccessForbiddenException");

const validation = Joi.object({
  distrito: Joi.number().empty(''),
  seccion_electoral: Joi.number().empty(''),
  mesa: Joi.string().required(),
  electores: Joi.number().empty(''),
  sobres: Joi.number().empty(''),
  especiales: Joi.object({
    [Acta.DetalleTipo.NULOS.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleTipo.RECURRIDOS.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleTipo.IMPUGNADOS.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleTipo.COMANDO.toLowerCase()]: Joi.number().empty('')
  }),
  detalle: Joi.array().items(Joi.object({
    [Acta.DetalleTipo.LISTA.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleCargo.DIPUTADOS_NACIONALES.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleCargo.DIPUTADOS_PROVINCIALES.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleCargo.SENADORES_NACIONALES.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleCargo.SENADORES_PROVINCIALES.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleCargo.CONCEJALES.toLowerCase()]: Joi.number().empty(''),
  })),
  estado: Joi.string().valid(...Object.values(Acta.Estado))
}).unknown(false)


const requiredListas = async (fiscal) => {
  // TODO
  return ["503", "505"];

}

const getActaTemplate = async (req, res, next) => {

  try {
    const fiscal = req.fiscal;

    const eleccion = await Eleccion.findEnCurso();

    if (!eleccion) {
      throw new Error("No hay elecciones en curso");
    }

    const reqListas = await requiredListas(fiscal);

    res.json({
      detalle: reqListas.map(lista => ({
        lista
      }))
    });
  } catch (error) {
    next(error);
  }
}

const detalleToJson = function (detalle, reqListas) {
  const listas = {}
  const especiales = {}

  detalle.forEach(d => {
    if (d.lista) {
      if (!listas[d.lista]) {
        listas[d.lista] = {
          lista: d.lista
        }
      }
      listas[d.lista][d.cargo.toLowerCase()] = d.votos;
    } else {
      especiales[d.tipo.toLowerCase()] = d.votos;
    }
  });

  reqListas.forEach(lista => {
    if (!listas[lista]) {
      listas[lista] = {lista}
    }
  })
  return {detalle: Object.values(listas), especiales};
};

const getActasFiscal = async (req, res, next) => {

  try {

    const actas = await Acta.findForFiscalEleccionEnCurso(req.fiscal.id);
    const reqListas = await requiredListas(req.fiscal);

    res.json(actas.map(acta => {
      const {id, mesa, electores, sobres, detalle} = acta.toJSON();

      const {detalleJSON, especiales} = detalleToJson(detalle, reqListas);

      const foto = req.protocol + '://' + req.get('host') + req.originalUrl.replace('fiscal', id) + '/photo'

      return {
        id, foto, mesa, electores, sobres, especiales, detalle: detalleJSON
      };
    }));

  } catch (e) {
    next(e);
  }

}

const getPhoto = async (req, res, next) => {

  try {
    const {id} = req.params;

    const acta = await Acta.findByPk(id);

    if (!acta || !acta.foto) {
      return next();
    }

    const options = {
      root: UPLOAD_PATH,
      dotfiles: "deny",
      headers: {
        "Content-Type": "image/jpg",
      },
    };

    res.sendFile(acta.foto, options);
  } catch (error) {
    next(error);
  }

};

const processFoto = async (acta, req) => {
  if (!req.files || !req.files.foto) {
    throw new Error("Falta la foto del acta");
  }

  const foto = req.files.foto;
  const filename = `${acta.eleccion}_${acta.distrito}_${acta.seccion_electoral}_${acta.mesa}_${foto.md5}${path.extname(foto.name)}`;
  const filePath = `${UPLOAD_PATH}/${filename}`;
  await foto.mv(filePath);

  const buffer = await readChunk(filePath, 0, 12);
  const imageData = imageType(buffer);
  const validMimes = ["image/png", "image/jpg", "image/jpeg"];

  // If the uploaded file type is not valid, delete it.
  if (!imageData || !validMimes.includes(imageData.mime)) {
    fs.unlinkSync(filePath);
    throw new UploadedFileIsNotAnImageException();
  }

  return filename;

}

const parseDetalle = (form, acta) => {
  const detalle = [];

  (form.detalle || []).forEach(d => {
    const lista = d.lista;
    for (const key in d) {
      if (key !== "lista") {
        const votos = d[key];
        if (votos) {
          detalle.push({
            acta,
            tipo: Acta.DetalleTipo.LISTA,
            lista: lista,
            cargo: key.toUpperCase(),
            votos
          })
        }
      }
    }
  })

  for (const key in (form.especiales || {})) {
    const votos = form.especiales[key];
    if (votos) {
      detalle.push({
        acta,
        tipo: key.toUpperCase(),
        votos
      })
    }
  }
  return detalle;
};

const handleUniqueConstraint = (error, acta) => {
  if (error instanceof UniqueConstraintError) {
    return new Error('La mesa ' + acta.mesa + ' del municipio ' + acta.seccion_electoral + ' ya fue cargada');
  }
  return error;
};

const postActaFiscal = async (req, res, next) => {

  let acta;

  try {

    const fiscal = req.fiscal;

    const form = await validation.validateAsync(JSON.parse(req.body.json));

    const eleccion = await Eleccion.findEnCurso();

    if (!eleccion) {
      throw new Error("No hay elecciones en curso");
    }

    const { mesa, electores, sobres } = form;

    acta = {
      mesa,
      electores,
      sobres
    }

    acta.fiscal = fiscal.id;
    acta.eleccion = eleccion.id;
    // como el fiscal no se puede asignar a una escuela que no corresponda con el mismo distrito/seccion electoral
    // que tiene puesto él, esta info se puede copiar directametne de su registro
    acta.distrito = fiscal.distrito;
    acta.seccion_electoral = fiscal.seccion_electoral;
    acta.estado = Acta.Estado.INGRESADA;

    acta.foto = await processFoto(acta, req);
    acta.detalle = parseDetalle(form);

    // Si la mesa ya estaba cargada, va a explotar por el indice unique
    const result = await Acta.create(acta, {
      include: Acta.detalle
    });
    res.status(201).json(result);

  } catch (error) {
    next(handleUniqueConstraint(error, acta));
  }
};

const putActaFiscal = async (req, res, next) => {

  let acta;

  try {

    const fiscal = req.fiscal;

    const { id } = req.params

    const form = await validation.validateAsync(JSON.parse(req.body.json));

    acta = await Acta.findByPk(id, {
      include: Acta.detalle
    });

    if (!acta) {
      return next();
    }

    if (acta.fiscal !== fiscal.id) {
      throw new AccessForbiddenException("Acta de otro fiscal");
    }

    if (acta.estado !== Acta.Estado.INGRESADA) {
      throw new AccessForbiddenException("Acta ya verificada");
    }

    acta.updateLog();

    const { mesa, electores, sobres } = form;

    acta.mesa = mesa;
    acta.electores = electores;
    acta.sobres = sobres;

    if (req.files && req.files) {
      acta.foto = await processFoto(acta, req);
    }

    const currentDetalle = acta.detalle;
    acta.detalle = parseDetalle(form, acta.id);

    await sequelize.transaction(async (transaction) => {

      await acta.save({ transaction });
      await Acta.ActaDetalle.destroy({ where: { id: currentDetalle.map(d => d.id) }, transaction});
      await Acta.ActaDetalle.bulkCreate(acta.detalle, { transaction });

    });

    acta.foto = req.protocol + '://' + req.get('host') + req.originalUrl.replace('fiscal', id) + '/photo'

    res.json(acta)

  } catch (error) {
    next(handleUniqueConstraint(error, acta));
  }

}


const getActasAdmin = async (req, res, next) => {

  try {

    let results;

    const baseOptions = {
      include: [{
        model: Eleccion,
        as: 'eleccion_'
      }, {
        model: Fiscal,
        as: 'fiscal_'
      }],
      limit: 50,
      offset: req.query.page ? Number(req.query.page) * 50 : undefined,
    }

    const queries = User.applyPrivilegesToQuery(req, true);

    const eleccion = req.query.eleccion || (await(Eleccion.findEnCurso()) || {}).id;
    if (eleccion) {
      queries.push({
        eleccion
      })
    }

    const mesa = req.query.mesa;

    if (mesa) {
      queries.push({
        mesa: mesa
      })
    }

    const fiscal = req.query.fiscal;
    if (fiscal) {
      queries.push({
        [Op.or]: {
          '$fiscal_.last_name$': {
            [Op.like]: `%${fiscal}%`,
          },
          '$fiscal_.dni$': fiscal
        },
      })
    }

    const estado = req.query.estado;
    if (estado) {
      queries.push({
        estado
      })
    }

    results = await Acta.findAll({
      ...baseOptions,
      where: {
        [Op.and]: queries,
      },
    });

    res.json(results);
  } catch (error) {
    next(error)
  }

}

const getActaAdmin = async (req, res, next) => {

  try {
    const acta = await Acta.findByPk(req.params.id, {
      include: 'detalle'
    });

    if (!acta) {
      return next();
    }

    const actaJSON = acta.toJSON();

    const {detalle, especiales} = detalleToJson(actaJSON.detalle, []);

    actaJSON.foto = req.protocol + '://' + req.get('host') + req.originalUrl + '/photo'
    actaJSON.detalle = detalle;
    actaJSON.especiales = especiales

    res.json(actaJSON);
  } catch (error) {
    next(error)
  }

}

const putActaAdmin = async (req, res, next) => {

  let acta;

  try {

    const { id } = req.params

    const form = await validation.validateAsync(JSON.parse(req.body.json));

    acta = await Acta.findByPk(id, {
      include: Acta.detalle
    });

    if (!acta) {
      return next();
    }

    acta.updateLog();

    const { distrito, seccion_electoral, mesa, electores, sobres, estado } = form;

    acta.distrito = distrito;
    acta.seccion_electoral = seccion_electoral;
    acta.mesa = mesa;
    acta.electores = electores;
    acta.sobres = sobres;
    acta.estado = estado;

    acta.verificador = req.user.id;

    if (req.files && req.files) {
      acta.foto = await processFoto(acta, req);
    }

    const currentDetalle = acta.detalle;
    acta.detalle = parseDetalle(form, acta.id);

    await sequelize.transaction(async (transaction) => {

      await acta.save({ transaction });
      await Acta.ActaDetalle.destroy({ where: { id: currentDetalle.map(d => d.id) }, transaction});
      await Acta.ActaDetalle.bulkCreate(acta.detalle, { transaction });

    });

    const actaJSON = acta.toJSON();

    actaJSON.foto = req.protocol + '://' + req.get('host') + req.originalUrl + '/photo'
    actaJSON.detalle = form.detalle;
    actaJSON.especiales = form.especiales;

    res.json(actaJSON)

  } catch (error) {
    next(handleUniqueConstraint(error, acta));
  }

}

const postActaAdmin = async (req, res, next) => {

  try {
    res.status(400)
  } catch (error) {
    next(error)
  }

}

const deleteActaAdmin = async (req, res, next) => {

  const { id } = req.params

  try {

    const acta = await Acta.findByPk(id);

    if (!acta) {
      return next();
    }

    if (req.user.role !== "ADMIN" && req.user.role !== "SUPERADMIN" && (acta.data_entry !== req.user.id)) {
      throw new AccessForbiddenException("eliminar actas de otros");
    }


    await sequelize.transaction(async (transaction) => {

      await acta.destroy({ transaction });
      await Acta.ActaDetalle.destroy({ where: { acta: id }, transaction});

    });

    res.status(204).json();

  } catch (error) {
    next(error)
  }

}

module.exports = {
  getActaTemplate,
  getActasFiscal,
  getPhoto,
  postActaFiscal,
  putActaFiscal,
  getActasAdmin,
  getActaAdmin,
  postActaAdmin,
  putActaAdmin,
  deleteActaAdmin,
};
