const Joi = require("joi");

const {
    Fiscal,
} = require("../models");

const fs = require("fs");

const path = require("path");

const imagesPath = path.join(__dirname, "../../public/images");
const uploadPath = path.join(__dirname, "../../public/profiles");

const readChunk = require("read-chunk");
const imageType = require("image-type");

const UploadedFileIsNotAnImageException = require("../exceptions/FileExceptions/UploadedFileIsNotAnImageException");


const getActasFiscal = async (req, res, next) => {
    res.json([])
}

const uploadPhoto = async (req, res, next) => {
/*
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

 */
};

const getPhoto = async (req, res, next) => {
  /*
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
  */
};

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

module.exports = {
    getActasFiscal,
    uploadPhoto,
    getPhoto,
    postResults,
};
