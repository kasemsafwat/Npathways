import { newInnstructorSchema ,loginInstructorSchema} from "../services/instructorValidation.service.js";
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
