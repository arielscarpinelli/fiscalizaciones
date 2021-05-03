import Joi from "joi";

const validation = Joi.object({
  id: Joi.number(),
  escuela: Joi.number().required(),
  electores_masculinos: Joi.number(),
  electores_femeninos: Joi.number()
});

export default validation;
