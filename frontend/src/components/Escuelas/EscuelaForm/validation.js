import Joi from "joi";

const validation = Joi.object({
  codigo: Joi.number().required(),
  nombre: Joi.string().trim().required(),
  direccion: Joi.string().trim().required(),
  localidad: Joi.string().empty("").trim().optional(),
  distrito: Joi.number().required(),
  seccion_electoral: Joi.number().required(),
  circuito: Joi.string().empty("").trim(),
  partido: Joi.number().required(),
  id: Joi.number(),
  lat_lon: Joi.object()
});

export default validation;
