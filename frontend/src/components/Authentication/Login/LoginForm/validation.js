import Joi from "joi";

const validation = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
});

export default validation;
