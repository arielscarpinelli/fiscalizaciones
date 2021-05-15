import Joi from "joi";

const validation = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  role: Joi.string()
    .trim()
    .valid("SUPERADMIN", "ADMIN", "OPERATOR")
    .required(),
  partido: Joi.number(),
  distrito: Joi.number().empty('').allow(null),
  seccion_electoral: Joi.number().empty('')
});

export default validation;
