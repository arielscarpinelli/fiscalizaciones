import Joi from "joi";

const validation = Joi.object({
  name: Joi.string()
    .trim()
    .required(),
});

export default validation;
