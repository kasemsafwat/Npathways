import Joi from "joi";

export let newInnstructorSchema = Joi.object({
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
      "any.required": "First name is required.",
    }),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(15)
    .trim()
    .required()
    .messages({
      "string.pattern.base": "Last name must contain only letters.",
      "string.min": "Last name must be at least 2 characters long.",
      "string.max": "Last name must not exceed 15 characters.",
      "any.required": "Last name is required.",
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .trim()
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required and cannot be empty.",
      "any.required": "Email is a required field.",
    }),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"
      )
    )
    .trim()
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain letters, numbers, and special characters (8-30 characters).",
      "string.empty": "Password is required and cannot be empty.",
      "any.required": "Password is a required field.",
    }),
});

export let loginInstructorSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .trim()
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required and cannot be empty.",
      "any.required": "Email is a required field.",
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"
      )
    )
    .trim()
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain letters, numbers, and special characters (8-30 characters).",
      "string.empty": "Password is required and cannot be empty.",
      "any.required": "Password is a required field.",
    }),
});
export let updateInstructorSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(15)
    .trim()
    .optional()
    .messages({
      "string.pattern.base": "First name must contain only letters.",
      "string.min": "First name must be at least 2 characters long.",
      "string.max": "First name must not exceed 15 characters.",
    }),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(15)
    .trim()
    .optional()
    .messages({
      "string.pattern.base": "Last name must contain only letters.",
      "string.min": "Last name must be at least 2 characters long.",
      "string.max": "Last name must not exceed 15 characters.",
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .trim()
    .optional()
    .messages({
      "string.email": "Please enter a valid email address.",
    }),
});
export const updatePasswordSchema = Joi.object({
    oldPassword: Joi.string()
    .pattern(
        new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"
        )
    )
    .trim()
    .required()
    .messages({
    "string.pattern.base":
        "Password must contain letters, numbers, and special characters (8-30 characters).",
      'string.base': 'Old password must be a string.',
      'string.empty': 'Old password cannot be empty.',
      'any.required': 'Old password is required.',
    }),
  newPassword: Joi.string()
    .pattern(
        new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"
        )
    )
    .trim()
    .required()
    .messages({
    "string.pattern.base":
        "Password must contain letters, numbers, and special characters (8-30 characters).",
      'string.base': 'New password must be a string.',
      'string.empty': 'New password cannot be empty.',
       'any.required': 'New password is required.',
    }),
});
export let resetPaswwordInstructorSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .trim()
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required and cannot be empty.",
      "any.required": "Email is a required field.",
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"
      )
    )
    .trim()
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain letters, numbers, and special characters (8-30 characters).",
      "string.empty": "Password is required and cannot be empty.",
      "any.required": "Password is a required field.",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .messages({
      "any.only": "Confirm password must match the password.",
      "string.empty": "Confirm Password is required and cannot be empty.",
      "any.required": "Confirm Password is a required field.",
    }),
});

