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
});

export default validation;
