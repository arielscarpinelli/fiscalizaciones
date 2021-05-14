import Joi from "joi";

const validation = Joi.object({
  id: Joi.number(),
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  dni: Joi.number().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phone: Joi.number().empty('').optional().default(null),
  address: Joi.string().trim().optional().default(null),
  distrito: Joi.number().required(),
  seccion_electoral: Joi.number().required(),
  escuela: Joi.number().allow(null).optional().default(null),
  mesa: Joi.number().allow(null).empty('').optional().default(null),
  partido: Joi.number().required(),
  lat_lon: Joi.object()
});

export default validation;
