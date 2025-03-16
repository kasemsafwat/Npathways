import {pathwaySchema} from "../services/pathwayValidation.service.js"

export function newPathWayValidation(req, res, next) {
  try {
    let { error } = pathwaySchema.validate(req.body);
    if (error) {
      let errMsg = error.details[0].message;
      return res.status(403).send({
        message: errMsg,
      });
    }
    next();
  } catch (error) {
    console.error('Validate new PathWay Error: ', error);
    return res.status(500).send({
      message: error.message,
    });
  }
}

