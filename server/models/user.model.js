import mongoose from "mongoose";
const Schema=mongoose.Schema
import bcrypt from "bcrypt"
const userSchema=new Schema ({
    firstName:{
        type:String,
        trim:true,
        required:true
    },
    lastName:{
        type:String,
        trim:true,
        required:true
    },
    email :{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password :{
        type:String,
        trim:true,
        required:true,
        minlength:8
    },
    // token:[{
    //     type:String,
    //     expires:"2d",
    //     trim:true
    // }]
    tokens: {
        type: [String], 
        default: [] 
    }
})

userSchema.pre('save',async function (next) {
    try {
        if(!this.isModified("password")){
           return next()
        }
        this.password=await bcrypt.hash(this.password,8)
        next()
    }catch(error){
            return next(error)
    }
})
 
const User=mongoose.model('user',userSchema)
export default User