import Joi from "joi";

const validation = Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  dni: Joi.number().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phone: Joi.number().empty('').optional(),
  address: Joi.string().trim().optional(),
  distrito: Joi.number().required(),
  seccion_electoral: Joi.number().required(),
  escuela: Joi.number().empty('').optional(),
  mesa: Joi.number().empty('').optional()
});

export default validation;
