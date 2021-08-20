import Joi from "joi";

const validation = Joi.object({
  mesa: Joi.string().trim().required(),
}).unknown(true);

export default validation;
