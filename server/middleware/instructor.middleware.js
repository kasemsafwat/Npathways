import { newInnstructorSchema ,loginInstructorSchema,updateInstructorSchema ,updatePasswordSchema,resetPaswwordInstructorSchema} from "../services/instructorValidation.service.js";
export function newInstructorValidation(req, res, next) {
        try {
            let {error} = newInnstructorSchema.validate(req.body);
            if (error) {
                let errMsg = error.details[0].message;
                return res.status(403).send({
                  message: errMsg,
                });
              }
              next();

        }catch(error){
            console.error('Validate new Instructor Error: ', error);
            return res.status(500).send({
              message: error.message,
            });
        }
}
export function LoginInstructorValidation(req, res, next) {
    try {
        let {error} = loginInstructorSchema.validate(req.body);
        if (error) {
            let errMsg = error.details[0].message;
            return res.status(403).send({
              message: errMsg,
            });
          }
          next();

    }catch(error){
        console.error('Validate Login Instructor Error: ', error);
        return res.status(500).send({
          message: error.message,
        });
    }
}

export function UpdateInstructorValidation(req, res, next) {
  try {
      let {error} = updateInstructorSchema.validate(req.body);
      if (error) {
          let errMsg = error.details[0].message;
          return res.status(403).send({
            message: errMsg,
          });
        }
        next();

  }catch(error){
      console.error('Validate Update Instructor Error: ', error);
      return res.status(500).send({
        message: error.message,
      });
  }
}

export function UpdateInstructorPasswordValidation(req, res, next) {
  try {
    let {error} = updatePasswordSchema.validate(req.body);
    if (error) {
        let errMsg = error.details[0].message;
        return res.status(403).send({
          message: errMsg,
        });
      }
      next();

}catch(error){
    console.error('Validate Update Password Instructor Error: ', error);
    return res.status(500).send({
      message: error.message,
    });
}
}
export function ResetPasswordInstructorValidation(req, res, next) {
  try {
    let { error } = resetPaswwordInstructorSchema.validate(req.body);
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