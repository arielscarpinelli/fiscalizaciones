import Joi from "joi";

const validation = Joi.object({
  dni: Joi.number().required(),
});

export default validation;
