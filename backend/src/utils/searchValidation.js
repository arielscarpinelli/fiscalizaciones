const Joi = require("joi");

const searchValidation = Joi.object({
  q: Joi.string().min(3).trim().required(),
});

module.exports = searchValidation;
