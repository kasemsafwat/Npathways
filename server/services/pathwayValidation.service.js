import Joi from "joi";
export let pathwaySchema = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Name is required and cannot be empty.",
            "any.required": "Name is a required field.",
        }),
        courses: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) 
        .custom((value, helpers) => {
            const uniqueCourses = [...new Set(value)];  
            if (uniqueCourses.length !== value.length) {
                return helpers.error("any.unique");
            }
            return value;
        })
        .messages({
            "array.base": "Courses must be an array.",
            "string.pattern.base": "Each course ID must be a valid MongoDB ObjectId.",
            "any.unique": "Each course must be unique in the pathway.",
        }),
});