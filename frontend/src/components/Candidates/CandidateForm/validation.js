import Joi from "joi";

const validation = Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  type_id: Joi.string().trim().valid("DNI", "PASAPORTE").required(),
  number_id: Joi.string().trim().required(),
  resume: Joi.string().trim().required(),
  expertise: Joi.string().trim().required(),
  video_resume: Joi.string().uri().required(),
}).options({ stripUnknown: true });

export default validation;
