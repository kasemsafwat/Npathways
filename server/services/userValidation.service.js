import Joi from "joi";


export let newUserSchema= Joi.object({
    firstName: Joi.string()
        .pattern(/^[A-Za-z]+$/)
        .min(2)
        .max(15)
        .trim()
        .required()
        .messages({
            "string.pattern.base": "First name must contain only letters.",
            "string.min": "First name must be at least 2 characters long.",
            "string.max": "First name must not exceed 15 characters.",
            "any.required": "First name is required."
        }),

    lastName: Joi.string()
        .pattern(/^[a-zA-Z]+$/)
        .min(2)
        .max(15)
        .trim()
        .required()
        .messages({
            "string.pattern.base": "Last name must contain only letters.",
            "string.min": "Last name must be at least 2 characters long.",
            "string.max": "Last name must not exceed 15 characters.",
            "any.required": "Last name is required."
        }),
     email: Joi.string()
     .email({ minDomainSegments: 2 })
     .trim()
     .required()
     .messages({
        "string.email": "Please enter a valid email address.",
        "string.empty": "Email is required and cannot be empty.",
        "any.required": "Email is a required field."    
     }),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .trim()
        .required()
        .messages({
            "string.pattern.base": "Password must contain only letters and numbers (3-30 characters).",
            "string.empty": "Password is required and cannot be empty.",
            "any.required": "Password is a required field."   
         }),
    
})

 