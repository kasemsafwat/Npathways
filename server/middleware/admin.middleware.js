import {
  newUserSchema,
  loginSchema,
  resetSchema,
} from "../services/adminValidation.service.js";

export function newAdminValidation(req, res, next) {
  try {
    let { error } = newUserSchema.validate(req.body);
    if (error) {
      let errMsg = error.details[0].message;
      return res.status(403).send({ message: errMsg });
    }
    // console.log(error.details[0].message);
    next();
  } catch (error) {
    console.error("Validate new user Error: ", error);
    return res.status(500).send({
      message: error.message,
    });
  }
}

export function loginValidation(req, res, next) {
  try {
    let { error } = loginSchema.validate(req.body);
    if (error) {
      let errMsg = error.details[0].message;
      return res.status(403).send({ message: errMsg });
    }
    // console.log(error.details[0].message);
    next();
  } catch (error) {
    console.error("Validate login Error: ", error);
    return res.status(500).send({
      message: error.message,
    });
  }
}

export function ResetValidation(req, res, next) {
  try {
    let { error } = resetSchema.validate(req.body);
    if (error) {
      let errMsg = error.details[0].message;
      return res.status(403).send({ message: errMsg });
    }
    // console.log(error.details[0].message);
    next();
  } catch (error) {
    console.error("Validate reset Error: ", error);
    return res.status(500).send({
      message: error.message,
    });
  }
}
