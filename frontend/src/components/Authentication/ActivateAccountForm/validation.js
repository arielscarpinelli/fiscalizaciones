import Joi from "joi";

const validation = Joi.object({
  password: Joi.string().trim().min(8).required(),
  confirmPassword: Joi.string()
    .trim()
    .min(8)
    .required()
    .equal(Joi.ref("password")),
});

export default validation;
