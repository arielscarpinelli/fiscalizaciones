import Joi from "joi";

const validation = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  jurisdiction: Joi.string()
    .valid("NACIONAL", "PROVINCIAL", "MUNICIPAL")
    .required(),
  province: Joi.when("jurisdiction", {
    not: "NACIONAL",
    then: Joi.string().required(),
  }),
  location: Joi.when("jurisdiction", {
    is: "MUNICIPAL",
    then: Joi.string().required(),
  }),
  requirements: Joi.string().required(),
  type: Joi.string().valid("INTERNA", "POLITICA").required(),
  quantityRepresentatives: Joi.number().integer().min(1).required(),
}).options({ stripUnknown: true });

export default validation;
