
const Joi = require("joi");
const crypto = require("crypto");
const { encrypt } = require("../utils/security");

const {
  Fiscal,
  Partido,
  User,
  sequelize,
} = require("../models");

const { Op } = require("sequelize");

const InvalidValidationCodeException = require("../exceptions/InvalidValidationCodeException");
const UnauthenticatedException = require("../exceptions/UnauthenticatedException");
const AccessForbiddenException = require("../exceptions/UserExceptions/AccessForbiddenException");

const sendCodeViaEmail = require("../helpers/sendCodeViaEmail");

const fs = require("fs");
const path = require("path");

const imagesPath = path.join(__dirname, "../../public/images");
const uploadPath = path.join(__dirname, "../../public/profiles");

const searchValidation = require("../utils/searchValidation");

const readChunk = require("read-chunk");
const imageType = require("image-type");

const UploadedFileIsNotAnImageException = require("../exceptions/FileExceptions/UploadedFileIsNotAnImageException");

const loginValidation = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
});


const codeValidation = Joi.object({
  code: Joi.string().length(6).trim().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
});

const validation = (user) => {
  let schema = {
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim().required(),
    dni: Joi.number().required(),
    email: Joi.string().email({tlds: {allow: false}}).required(),
    phone: Joi.number().empty('').optional(),
    address: Joi.string().trim().optional(),
    distrito: Joi.number().required(),
    seccion_electoral: Joi.number().required(),
    escuela: Joi.number().empty('').optional(),
    mesa: Joi.number().empty('').optional(),
    partido: Joi.number().required(),
  };
  const partido = User.getPartido(user);
  if (partido) {
   schema.partido = schema.partido.equal(partido);
  }
  return Joi.object(schema);
}

const validatePartido = (user, fiscal) => {
  const partido = User.getPartido(user);
  if (partido && partido !== fiscal.partido) {
    throw new AccessForbiddenException("fiscal de otro partido");
  }
}

const loginFiscal = async (req, res, next) => {
  try {

    const { email } = await loginValidation.validateAsync(req.body);

    const fiscal = Fiscal.findByEmail(email);

    if (fiscal) {
      await sendCodeViaEmail(fiscal);
    }// Si el fiscal no existe, NO-OP. Esto es para no develar la base de direcciones de email
    

    res.json();

  } catch (error) {
    next(error);
  }
};

const validateEmail = async (req, res, next) => {
  try {
    const { code, email } = await codeValidation.validateAsync(req.body);

    const fiscal = Fiscal.findByEmail(email);

    if (!fiscal) {
      throw new UnauthenticatedException();
    }

    if (Number(code) !== Number(fiscal.code)) {
      throw new InvalidValidationCodeException();
    }

    const token = crypto.randomBytes(36).toString("hex");
    const encryptedToken = encrypt(token);
    const encodedToken = Buffer.from(encryptedToken).toString("base64");

    fiscal.token = encodedToken;
    await fiscal.save();

    res.json({
      token: encodedToken,
    });
  } catch (error) {
    next(error);
  }
};


/*
const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.files || !req.files.photo) {
      throw new Error("No file uploaded");
    }

    const { id } = req.params;

    const fiscal = await Fiscal.findByPk(id);

    if (!fiscal) {
      return next();
    }

    const photo = req.files.photo;
    const filename = `${photo.md5}_${photo.name}`;
    photo.mv(`${uploadPath}/${filename}`);

    const buffer = await readChunk(`${uploadPath}/${filename}`, 0, 12);
    const imageData = imageType(buffer);
    const validMimes = ["image/png", "image/png", "image/jpeg"];

    // If the uploaded file type is not valid, delete it.
    if (!imageData || !validMimes.includes(imageData.mime)) {
      fs.unlinkSync(`${uploadPath}/${filename}`);
      throw new UploadedFileIsNotAnImageException();
    }

    // Delete old fiscal's photo if it exists.
    if (fiscal.photo) {
      fs.unlinkSync(`${uploadPath}/${fiscal.photo}`);
    }

    fiscal.photo = filename;
    await fiscal.save();

    res.json();
  } catch (error) {
    next(error);
  }
};

const getPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fiscal = await Fiscal.findByPk(id);

    if (!fiscal) {
      return next();
    }

    const rootPath = fiscal.photo ? uploadPath : imagesPath;
    const photo = fiscal.photo || "noavatar.jpg";

    const options = {
      root: rootPath,
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
        "Content-Type": "image/jpg",
      },
    };

    res.sendFile(photo, options);
  } catch (error) {
    next(error);
  }
};
*/
const postResults = async (req, res, next) => {
  try {

    // TODO

    /*


    const { affiliate } = req;

    if (!affiliate.isReady()) {
      throw new UnauthenticatedException();
    }

    const { votingId, votes } = await votesValidation.validateAsync(req.body);

    const { emittedVotes, hash } = await processVotes(
      votingId,
      affiliate,
      votes
    );

    // #002 Implementar transaccion al votar, si hay un error, marca como que voté, y el hash no existe.
    await sequelize.transaction(async (t) => {
      if (emittedVotes.length !== 0) {
        await Vote.bulkCreate(emittedVotes);
      }

      await AffiliateVote.create({
        VotingId: votingId,
        dni: affiliate.dni,
      });
    });

    res.json({
      hash,
    });

    */
  } catch (error) {
    next(error);
  }
};


const searchFiscales = async (req, res, next) => {
  try {

    let results;

    const baseOptions = {
      include: {
        model: Partido,
        as: 'partido_'
      },
      limit: 50,
      offset: req.page,
    }

    const queries = [];

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
          dni: {
            [Op.like]: `%${q}%`,
          },
        },
      });
    }
    /*
    await queryInterface.addIndex("Fiscales", 'distrito');
    await queryInterface.addIndex("Fiscales", 'seccion_electoral');
    await queryInterface.addIndex("Fiscales", 'escuela');
    await queryInterface.addIndex("Fiscales", 'mesa');

    */

    const partido = User.getPartido(req.user) || req.query.partido;

    if (partido) {
      queries.push({
        partido
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
    const data = await validation(req.user).validateAsync(req.body);
    const fiscal = await Fiscal.create(data);
    res.status(201).json(fiscal);
  } catch (error) {
    next(error);
  }
};

const putFiscal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await validation(req.user).validateAsync(req.body);
    const fiscal = await Fiscal.findByPk(id);

    if (!fiscal) {
      return next();
    }

    validatePartido(req.user, fiscal);

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
  loginFiscal,
  validateEmail,
  postResults,
};
