const Joi = require("joi");

const {
  Fiscal,
} = require("../models");

const crypto = require("crypto");
const { encrypt } = require("../utils/security");


const InvalidValidationCodeException = require("../exceptions/InvalidValidationCodeException");
const UnauthenticatedException = require("../exceptions/UnauthenticatedException");

const sendCodeViaEmail = require("../helpers/sendCodeViaEmail");

const loginValidation = Joi.object({
  dni: Joi.number().required(),
});


const codeValidation = Joi.object({
  code: Joi.string().length(6).trim().required(),
  dni: Joi.number().required(),
});

const loginFiscal = async (req, res, next) => {
  try {

    const { dni } = await loginValidation.validateAsync(req.body);

    const fiscal = await Fiscal.findByDNI(dni);

    if (fiscal) {
      await sendCodeViaEmail(fiscal);
    }// Si el fiscal no existe, NO-OP. Esto es para no develar la base de direcciones de email


    res.json({ dni });

  } catch (error) {
    next(error);
  }
};

const validateEmail = async (req, res, next) => {
  try {
    const { code, dni } = await codeValidation.validateAsync(req.body);

    const fiscal = await Fiscal.findByDNI(dni);

    if (!fiscal) {
      throw new UnauthenticatedException();
    }

    if (Number(code) !== Number(fiscal.code)) {
      throw new InvalidValidationCodeException();
    }

    const token = crypto.randomBytes(36).toString("hex");
    fiscal.token = token;
    await fiscal.save();

    const encryptedToken = encrypt(token);
    const encodedToken = Buffer.from(encryptedToken).toString("base64");

    res.json({
      token: encodedToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginFiscal,
  validateEmail,
};