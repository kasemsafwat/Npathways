import {newUserSchema} from "../services/userValidation.service.js"

export function  newUserValidation(req,res,next) {
        try {
                 let {error}=newUserSchema.validate(req.body)
                if(error){
                  let errMsg=error.details[0].message
                  return res.status(403).send({
                        message:errMsg
                  })
                }
                next()
                return res.send()
        }catch(error){
                res.status(500).send({
                        message:error.message
                })
        }
}