const Joi = require("joi");
const crypto = require("crypto");
const { encrypt } = require("../utils/security");

const {
  Fiscal,
  sequelize,
} = require("../models");

const { Op } = require("sequelize");

const InvalidValidationCodeException = require("../exceptions/InvalidValidationCodeException");
const UnauthenticatedException = require("../exceptions/UnauthenticatedException");

const sendCodeViaEmail = require("../helpers/sendCodeViaEmail");

const fs = require("fs");
const path = require("path");

const imagesPath = path.join(__dirname, "../../public/images");
const uploadPath = path.join(__dirname, "../../public/profiles");

const searchValidation = require("../utils/searchValidation");

const readChunk = require("read-chunk");
const imageType = require("image-type");

const UploadedFileIsNotAnImageException = require("../exceptions/FileExceptions/UploadedFileIsNotAnImageException");

const codeValidation = Joi.object({
  code: Joi.string().length(6).trim().required(),
});

const validation = Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  type_id: Joi.string().trim().required(),
  number_id: Joi.string().trim().required(),
  resume: Joi.string().trim().required(),
  expertise: Joi.string().trim().required(),
  video_resume: Joi.string().uri().required(),
});

const loginFiscal = async (req, res, next) => {
  try {

    // TODO: login del fiscal

    /*

    const token = crypto.randomBytes(36).toString("hex");
    const encryptedToken = encrypt(token);
    const encodedToken = Buffer.from(encryptedToken).toString("base64");

    const affiliate = new Affiliate({
      dni: number_id,
      token,
    });

    const { email } = await sendCodeViaEmail(affiliate);

    res.json({
      email,
      token: encodedToken,
    });

    */


  } catch (error) {
    next(error);
  }
};

const validateEmail = async (req, res, next) => {
  const { affiliate } = req;

  try {
    const { code } = await codeValidation.validateAsync(req.body);

    if (Number(code) !== Number(affiliate.code)) {
      throw new InvalidValidationCodeException();
    }

    await affiliate.ready();

    res.json({
      nextStep: affiliate.login_step,
    });
  } catch (error) {
    next(error);
  }
};

const validatePhone = async (req, res, next) => {
  const { affiliate } = req;

  try {
    const { code } = await codeValidation.validateAsync(req.body);

    if (Number(code) !== Number(affiliate.code)) {
      throw new InvalidValidationCodeException();
    }

    await affiliate.ready();

    res.json({
      nextStep: affiliate.login_step,
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
    const { q } = await searchValidation.validateAsync(req.query);

/*
await queryInterface.addIndex("Fiscales", 'distrito');
await queryInterface.addIndex("Fiscales", 'seccion_electoral');
await queryInterface.addIndex("Fiscales", 'escuela');
await queryInterface.addIndex("Fiscales", 'mesa');

*/
    const splittedTerm = q.split(" ");

    const query = splittedTerm.map((q) => {
      return {
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
      };
    });

    const results = await Fiscal.findAll({
      where: {
        [Op.or]: query,
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

    res.json(fiscal);
  } catch (error) {
    next(error);
  }
};

const postFiscal = async (req, res, next) => {
  try {
    const data = await validation.validateAsync(req.body);
    const fiscal = await Fiscal.create(data);
    res.status(201).json(fiscal);
  } catch (error) {
    next(error);
  }
};

const putFiscal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await validation.validateAsync(req.body);
    const fiscal = await Fiscal.findByPk(id);

    if (!fiscal) {
      return next();
    }

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
  validatePhone,
  postResults,
};
