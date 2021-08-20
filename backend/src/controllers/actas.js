const Joi = require("joi");

const {
  Acta,
  Eleccion,
} = require("../models");

const fs = require("fs");

const path = require("path");

const {UPLOAD_PATH} = require("../config");

const readChunk = require("read-chunk");
const imageType = require("image-type");

const UploadedFileIsNotAnImageException = require("../exceptions/FileExceptions/UploadedFileIsNotAnImageException");
const {UniqueConstraintError} = require("sequelize");

const validation = Joi.object({
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
  }))
}).unknown(false)


const requiredListas = async (fiscal) => {
  // TODO
  return ["503"];

}

const getActaDefault = async (req, res, next) => {

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

}



const getActasFiscal = async (req, res, next) => {

  const actas = await Acta.findForFiscalEleccionEnCurso(req.fiscal.id);
  const reqListas = await requiredListas(req.fiscal);

  res.json(actas.map(acta => {
    const {id, mesa, electores, sobres, detalle} = acta.toJSON();

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
      if(!listas[lista]) {
        listas[lista] = { lista }
      }
    })


    const foto = req.protocol + '://' + req.get('host') + req.originalUrl.replace('fiscal', id) + '/photo'

    return {
      id, foto, mesa, electores, sobres, especiales, detalle: Object.values(listas)
    };
  }));

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

const postActaFiscal = async (req, res, next) => {

  let acta;

  try {

    const fiscal = req.fiscal;

    const form = await validation.validateAsync(JSON.parse(req.body.json));

    if (!req.files || !req.files.foto) {
      throw new Error("Falta la foto del acta");
    }

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

    acta.foto = filename;

    acta.detalle = [];

    form.detalle.forEach(d => {
      const lista = d.lista;
      for (const key in d) {
        if (key !== "lista") {
          const votos = d[key];
          if (votos) {
            acta.detalle.push({
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
        acta.detalle.push({
          tipo: key.toUpperCase(),
          votos
        })
      }
    }

    // Si la mesa ya estaba cargada, va a explotar por el indice unique
    const result = await Acta.create(acta, {
      include: Acta.detalle
    });
    res.status(201).json(result);

  } catch (error) {
    if(error instanceof UniqueConstraintError ) {
      next({
        message: 'La mesa ' + acta.mesa + ' del municipio ' + acta.seccion_electoral + ' ya fue cargada'
      });
    }
    next(error);
  }
};

module.exports = {
  getActaDefault,
  getActasFiscal,
  getPhoto,
  postActaFiscal,
};
