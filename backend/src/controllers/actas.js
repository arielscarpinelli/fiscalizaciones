const Joi = require("joi");

const {
  Acta,
  Eleccion,
  Escuela,
  User,
  Fiscal,
  Listas,
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
const ValidationException = require("../exceptions/ValidationException");

const validation = Joi.object({
  distrito: Joi.number().empty(''),
  seccion_electoral: Joi.number().empty(''),
  mesa: Joi.number().required(),
  electores: Joi.number().empty(''),
  sobres: Joi.number().empty(''),
  especiales: Joi.object({
    [Acta.DetalleTipo.NULOS.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleTipo.RECURRIDOS.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleTipo.IMPUGNADOS.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleTipo.COMANDO.toLowerCase()]: Joi.number().empty('')
  }),
  detalle: Joi.array().items(Joi.object({
    [Acta.DetalleTipo.LISTA.toLowerCase()]: Joi.string().empty(''),
    [Acta.DetalleCargo.DIPUTADOS_NACIONALES.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleCargo.LEGISLADORES_PROVINCIALES.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleCargo.CONCEJALES.toLowerCase()]: Joi.number().empty(''),
    [Acta.DetalleCargo.PRESIDENTE.toLowerCase()]: Joi.number().empty(''),
  })),
  estado: Joi.string().valid(...Object.values(Acta.Estado))
}).unknown(false)


const doGetActaTemplate = async (req, res, next, distrito, seccion_electoral) => {
  try {

    const eleccion = await Eleccion.findEnCurso();

    if (!eleccion) {
      throw new Error("No hay elecciones en curso");
    }

    const reqListas = await Listas.findForEleccion(eleccion.id, distrito, seccion_electoral)

    res.json({
      detalle: reqListas.map(lista => {
        const detalle = {
          lista: lista.lista
        }

        lista.cargos.split(',').forEach(cargo => {
          detalle[cargo] = ""
        })

        return detalle;
      })
    });
  } catch (error) {
    next(error);
  }
}

const getActaTemplate = async (req, res, next) => {
  return doGetActaTemplate(req, res, next, req.fiscal.distrito, req.fiscal.seccion_electoral)
}

const detalleToJson = function (detalle, reqListas) {
  const listas = {}
  const especiales = {}

  detalle.forEach(d => {
    if (d.lista || d.cargo) {
      const key = d.lista || d.tipo.toLowerCase();
      if (!listas[key]) {
        listas[key] = {
          lista: d.lista,
          tipo: d.tipo.toLowerCase()
        }
      }
      listas[key][d.cargo.toLowerCase()] = d.votos;
    } else {
      especiales[d.tipo.toLowerCase()] = d.votos;
    }
  });

  reqListas.forEach(lista => {
    const key = lista.lista;
    if (!listas[key]) {
      listas[key] = {
        lista: key,
        tipo: Acta.DetalleTipo.LISTA,
      }
      lista.cargos.split(',').forEach(cargo => {
        listas[key][cargo] = '';
      })
    }
  })
  return {detalle: Object.values(listas), especiales};
};

const getActasFiscal = async (req, res, next) => {

  try {

    const eleccion = await Eleccion.findEnCurso();

    if (!eleccion) {
      throw new Error("No hay elecciones en curso");
    }

    const actas = await Acta.findForFiscalEleccionEnCurso(req.fiscal);
    const reqListas = await Listas.findForEleccion(eleccion.id, req.fiscal.distrito, req.fiscal.seccion_electoral);

    res.json(actas.map(acta => {
      const actaJson = acta.toJSON();
      const {id, mesa, electores, sobres} = actaJson;

      const {detalle, especiales} = detalleToJson(actaJson.detalle, reqListas);

      const foto = req.protocol + '://' + req.get('host') + req.originalUrl.replace('fiscal', id) + '/photo'

      const foto2 = !actaJson.foto2 ? undefined : req.protocol + '://' + req.get('host') + req.originalUrl.replace('fiscal', id) + '/photo?index=2'

      return {
        id, foto, foto2, mesa, electores, sobres, especiales, detalle
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
    
    const field = 'foto' + (req.query.index || '');

    if (!acta || !acta[field]) {
      return next();
    }

    const options = {
      root: UPLOAD_PATH,
      dotfiles: "deny",
      headers: {
        "Content-Type": "image/jpg",
      },
    };

    res.sendFile(acta[field], options);
  } catch (error) {
    next(error);
  }

};

const processFoto = async (acta, req, field = 'foto') => {
  if (!req.files || !req.files[field]) {
    throw new Error("Falta la foto del acta");
  }

  const foto = req.files[field];
  const filename = `${acta.eleccion}_${acta.distrito}_${acta.seccion_electoral}_${acta.mesa}_${field}_${foto.md5}${path.extname(foto.name)}`;
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
    const tipo = (d.tipo || Acta.DetalleTipo.LISTA).toUpperCase()
    for (const key in d) {
      if (key !== "lista" && key !== "tipo") {
        const votos = d[key];
        if (votos) {
          detalle.push({
            acta,
            tipo,
            lista,
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
    return new ValidationException('La mesa ' + acta.mesa + ' del municipio ' + acta.seccion_electoral + ' ya fue cargada', 'mesa');
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

    if (fiscal.escuela) {
      const escuela = await Escuela.findByPk(fiscal.escuela);
      if (mesa < escuela.min_mesa || mesa > escuela.max_mesa) {
        throw new ValidationException("la mesa " + mesa + " no pertence a la escuela asignada (" + escuela.min_mesa + " - " + escuela.max_mesa + ")", "mesa")
      }
      acta.escuela = escuela.id;
    } else {
      acta.escuela = ((await Escuela.findByMesa(fiscal.distrito, fiscal.seccion_electoral, mesa)) || {}).id;
    }

    acta.fiscal = fiscal.id;
    acta.eleccion = eleccion.id;
    // como el fiscal no se puede asignar a una escuela que no corresponda con el mismo distrito/seccion electoral
    // que tiene puesto él, esta info se puede copiar directametne de su registro
    acta.distrito = fiscal.distrito;
    acta.seccion_electoral = fiscal.seccion_electoral;
    acta.estado = Acta.Estado.INGRESADA;

    acta.foto = await processFoto(acta, req);
    if (req.files.foto2) {
      acta.foto2 = await processFoto(acta, req, 'foto2');
    }
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

    if ((acta.fiscal !== fiscal.id) && (acta.escuela !== fiscal.escuela)) {
      throw new AccessForbiddenException("Acta de otro fiscal y/o escuela");
    }

    if (acta.estado !== Acta.Estado.INGRESADA) {
      throw new AccessForbiddenException("Acta ya verificada");
    }

    acta.updateLog();

    const { mesa, electores, sobres } = form;

    if (fiscal.escuela) {
      const escuela = await Escuela.findByPk(fiscal.escuela);
      if (mesa < escuela.min_mesa || mesa > escuela.max_mesa) {
        throw new ValidationException("la mesa " + mesa + " no pertence a la escuela asignada (" + escuela.min_mesa + " - " + escuela.max_mesa + ")", "mesa")
      }
      acta.escuela = escuela.id;
    } else {
      acta.escuela = ((await Escuela.findByMesa(fiscal.distrito, fiscal.seccion_electoral, mesa)) || {}).id;
    }

    acta.mesa = mesa;
    acta.electores = electores;
    acta.sobres = sobres;
    acta.fiscal = fiscal.id;

    if (req.files && req.files.foto) {
      acta.foto = await processFoto(acta, req);
    }
    if (req.files && req.files.foto2) {
      acta.foto2 = await processFoto(acta, req, 'foto2');
    }

    const currentDetalle = acta.detalle;
    acta.detalle = parseDetalle(form, acta.id);

    await sequelize.transaction(async (transaction) => {

      await acta.save({ transaction });
      await Acta.ActaDetalle.destroy({ where: { id: currentDetalle.map(d => d.id) }, transaction});
      await Acta.ActaDetalle.bulkCreate(acta.detalle, { transaction });

    });

    acta.foto = req.protocol + '://' + req.get('host') + req.originalUrl.replace('fiscal', id) + '/photo'
    acta.foto2 = !acta.foto2 ? undefined : req.protocol + '://' + req.get('host') + req.originalUrl.replace('fiscal', id) + '/photo?index=2'

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
      }, {
        model: Escuela,
        as: 'escuela_'
      }, {
        model: User,
        as: 'data_entry_'
      }, {
        model: User,
        as: 'verificador_'
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

    const escuela = req.query.escuela;
    if (escuela) {
      queries.push(escuela === 'any' ? {
        escuela: {
          [Op.ne]: null
        }
      } : escuela === 'none' ? {
        escuela: {
          [Op.eq]: null
        }
      } : {
        escuela
      })
    }

    const fiscal = req.query.fiscal;
    if (fiscal) {
      queries.push({
        [Op.or]: {
          '$fiscal_.last_name$': {
            [Op.like]: `${fiscal}%`,
          },
          '$fiscal_.dni$': fiscal,
          '$data_entry_.email$': {
            [Op.like]: `${fiscal}%`,
          },
          '$data_entry_.name$': {
            [Op.like]: `${fiscal}%`,
          }
        },
      })
    }

    const verificador = req.query.verificador;
    if (verificador) {
      queries.push({
        [Op.or]: {
          '$verificador_.email$': {
            [Op.like]: `${verificador}%`,
          },
          '$verificador_.name$': {
            [Op.like]: `${verificador}%`,
          }
        }
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

    const acta = await (req.params.id !== 'next' ? Acta.findByPk(req.params.id, {
      include: 'detalle'
    }) : Acta.findNextToCheck(req.query));

    if (!acta) {
      return next();
    }

    const actaJSON = acta.toJSON();

    const {detalle, especiales} = detalleToJson(actaJSON.detalle, await Listas.findForEleccion(acta.eleccion, acta.distrito, acta.seccion_electoral));

    actaJSON.foto = req.protocol + '://' + req.get('host') + '/api/v1/actas/' + acta.id + '/photo'
    actaJSON.foto2 = !actaJSON.foto2 ? undefined : (req.protocol + '://' + req.get('host') +'/api/v1/actas/' + acta.id + '/photo?index=2')
    actaJSON.detalle = detalle;
    actaJSON.especiales = especiales

    res.json(actaJSON);
  } catch (error) {
    next(error)
  }

}

const getActaTemplateAdmin = async (req, res, next) => {
  return doGetActaTemplate(req, res, next, req.query.distrito, req.query.seccion_electoral)
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
    acta.escuela = ((await Escuela.findByMesa(distrito, seccion_electoral, mesa)) || {}).id;
    acta.electores = electores;
    acta.sobres = sobres;
    acta.estado = estado;

    if (acta.fiscal || (acta.data_entry !== req.user.id)) {
      acta.verificador = req.user.id;
    }

    if (req.files && req.files.foto) {
      acta.foto = await processFoto(acta, req);
    }
    if (req.files && req.files.foto2) {
      acta.foto2 = await processFoto(acta, req, 'foto2');
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
    actaJSON.foto2 = !actaJSON.foto2 ? undefined : (req.protocol + '://' + req.get('host') + req.originalUrl + '/photo?index=2')
    actaJSON.detalle = form.detalle;
    actaJSON.especiales = form.especiales;

    res.json(actaJSON)

  } catch (error) {
    next(handleUniqueConstraint(error, acta));
  }

}

const postActaAdmin = async (req, res, next) => {

  let acta;

  try {

    const form = await validation.validateAsync(JSON.parse(req.body.json));

    const eleccion = await Eleccion.findEnCurso();

    if (!eleccion) {
      throw new Error("No hay elecciones en curso");
    }

    const {distrito, seccion_electoral, mesa, electores, sobres, estado } = form;

    acta = {
      distrito,
      seccion_electoral,
      mesa,
      electores,
      sobres,
      estado
    }

    acta.data_entry = req.user.id;
    acta.eleccion = eleccion.id;
    acta.escuela = ((await Escuela.findByMesa(distrito, seccion_electoral, mesa)) || {}).id;

    acta.foto = await processFoto(acta, req);
    if (req.files && req.files.foto2) {
      acta.foto2 = await processFoto(acta, req, 'foto2');
    }
    acta.detalle = parseDetalle(form);

    // Si la mesa ya estaba cargada, va a explotar por el indice unique
    const result = await Acta.create(acta, {
      include: Acta.detalle
    });
    res.status(201).json(result);

  } catch (error) {
    next(handleUniqueConstraint(error, acta));
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
  getActaTemplateAdmin,
  postActaAdmin,
  putActaAdmin,
  deleteActaAdmin,
};
