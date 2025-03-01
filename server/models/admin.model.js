import mongoose from "mongoose";
const Schema=mongoose.Schema
import bcrypt from "bcrypt"
const adminSchema=new Schema({
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
        unique:true,
        lowercase: true
    },
    password :{
        type:String,
        trim:true,
        required:true,
        minlength:8
    },
    role:{
        type:String,
        enum:['admin', 'instructor'],
        required:true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"   
    }],
    tokens: {
        type: [String], 
        default: [] 
    },
    image:{
        type:String,
        trim:true
    },
    changePasswordAt: Date,
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available',
    },
})


adminSchema.pre('save', async function (next) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      this.password = await bcrypt.hash(this.password, 8);
      next();
    } catch (error) {
      console.error('Admin pre save Error: ', error);
      return next(error);
    }
});
 
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;