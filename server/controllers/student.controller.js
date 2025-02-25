import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const StudentControlller = {
     deleteStudent:async(req,res)=>{
         try {
            let {id}=req.params
            await User.findByIdAndDelete(id)
            res.send({
                message:"Account deleted "
            })
         }catch(error){
            return res.status(500).send({
                 message: 'userController: ' + error.message
             });
         }
     },
     updateStudent:async(req,res)=>{
        try{
            if(req.file){
                var image=`/api/student/${req.file.filename}`
            }
            let user=await User.findByIdAndUpdate(req.user._id,{...req.body,image},{new:true})
            res.send(user)
        }catch(error){
            return res.status(500).send({
                message: 'userController: ' + error.message
            });
        }
     },
     updatePassword:async(req,res)=>{
        try{
            let {newPassword,oldPassword}=req.body
            let user=await User.findById(req.user._id)
            let validPassword=await bcrypt.compare(oldPassword,user.password)
            if(!validPassword){
                return res.status(403).send({
                    message:"Invalid old Password"
                })
            }
            user.password=newPassword
            await user.save()
            res.send({
                message:"Password Update"
            })
        }catch(error){
            return res.status(500).send({
                message: 'userController: ' + error.message
            });
        }
     },
     getStudent:async (req,res)=>{
        try{
            let user=await User.findById(req.user._id)
            let userObject = user.toObject();
            delete userObject.password;
            delete userObject.tokens;
            res.send(userObject)
        }catch(error){
            return res.status(500).send({
                message: 'userController: ' + error.message
            });   
        }
     }
}

export default StudentControlller;
