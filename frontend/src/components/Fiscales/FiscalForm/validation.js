import Joi from "joi";

const validation = Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  dni: Joi.string().trim().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
}).options({ stripUnknown: true });

export default validation;
