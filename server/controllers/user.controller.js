import User from "../models/user.model.js";

const userController ={
      newUser : async (req,res)=>{
        try {
            let data=req.body
            let duplicateEmail=await User.findOne({email:data.email})
            if(duplicateEmail){
               return  res.status(403).send({
                message: "This email is already registered. Please use a different email."   
            })
            }
            let newUser=new User(data)
            await newUser.save()
            res.status(201).send({
                message:"Create Account"
            })
        }catch(error){
            res.status(500).send({
                message:error.message
            })
        }

      }
}
export default userController