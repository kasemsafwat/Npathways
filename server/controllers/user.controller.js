import User from "../models/user.model";

const userController ={
      newUser : async (req,res)=>{
        try {

        }catch(error){
            res.status(500).send({
                message:error.message
            })
        }

      }
}