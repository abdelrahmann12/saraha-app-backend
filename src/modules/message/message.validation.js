
import Joi from "joi";

export const messageValidation = Joi.object({
    content:Joi.string().min(3).max(1000),
    
})