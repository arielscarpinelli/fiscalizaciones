import Joi from "joi";

const validation = Joi.object({
  name: Joi.string().trim().required(),
  type: Joi.string().valid("INTERNA", "POLITICA").required(),
  votingStartDate: Joi.date().required(),
  votingEndDate: Joi.date().min(Joi.ref("votingStartDate")).required(),
}).options({ stripUnknown: true });
export default validation;
