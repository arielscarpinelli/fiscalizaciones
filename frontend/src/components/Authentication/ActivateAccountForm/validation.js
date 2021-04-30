import Joi from "joi";
import {JoiPasswordComplexity} from "joi-password";

const validation = Joi.object({
    password: JoiPasswordComplexity.string()
        .trim()
        .min(8)
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .required(),
    confirmPassword: Joi.string()
        .trim()
        .min(8)
        .required()
        .equal(Joi.ref("password")),
});

export default validation;
