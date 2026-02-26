import Joi from "joi";

export const registerSchema = Joi.object({
      fName: Joi.string().min(3).max(50).required(),
      lName: Joi.string().min(3).max(50).required(),
      email: Joi.string().email(),
      pass: Joi.string().required(),
      dob: Joi.date(),
      phone: Joi.string().length(11),
    }).or("email", "phone");



