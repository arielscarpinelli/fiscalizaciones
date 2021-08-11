import Joi from "joi";

const validation = Joi.object({
  code: Joi.string().length(6).trim().required(),
});

export default validation;
