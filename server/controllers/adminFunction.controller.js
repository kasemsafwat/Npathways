import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const AdminControlller = {
    deleteInstructor:async(req,res)=>{
        try {
           let {id}=req.params
           await Admin.findByIdAndDelete(id)
           res.send({
               message:"Account deleted "
           })
        }catch(error){
           return res.status(500).send({
                message: 'AdminController: ' + error.message
            });
        }
    },
    updateProfile:async(req,res)=>{
        try {
            if(req.file){
                var image=`/api/admin/${req.file.filename}`
            }
           
        const { password, ...updateData } = req.body;

         let admin = await Admin.findByIdAndUpdate(
            req.admin._id,
            { ...updateData, image },
            { new: true }
        );

        res.send(admin);
        }catch(error){
            return res.status(500).send({
                message: 'AdminController: ' + error.message
        });
        }
    },
  
    updatePassword:async(req,res)=>{
       try{
           let {newPassword,oldPassword}=req.body
           let admin=await Admin.findById(req.admin._id)
           let validPassword=await bcrypt.compare(oldPassword,admin.password)
           if(!validPassword){
               return res.status(403).send({
                   message:"Invalid old Password"
               })
           }
           admin.password=newPassword
           await admin.save()
           res.send({
               message:"Password Update"
           })
       }catch(error){
           return res.status(500).send({
               message: 'AdminController: ' + error.message
           });
       }
    },
    getprofile:async(req,res)=>{
        try{
            let admin=await Admin.findById(req.admin._id)
            let adminObject = admin.toObject();
            delete adminObject.password;
            delete adminObject.tokens;
            res.send(adminObject)
        }catch(error){
            return res.status(500).send({
                message: 'AdminController: ' + error.message
            });   
        }
    },
//    //////////////Admin/////////////////////////////////
   
  getAllInstructors: async (req, res) => {
    try {
        const instructors = await Admin.find({ role: 'instructor' }).select('-password -tokens');
        res.status(200).send(instructors);
    } catch (error) {
        res.status(500).send({ message: 'Error Get instructors: ' + error.message });
    }
  },
  getOneInstructor: async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await Admin.findOne({ _id: id, role: 'instructor' }).select('-password -tokens');
        if (!instructor) {
            return res.status(404).send({ message: 'Instructor not found' });
        }

        res.status(200).send(instructor);
    } catch (error) {
        res.status(500).send({ message: 'Error Get instructor: ' + error.message });
    }
  },
  createInstructor:async(req,res)=>{
        try {
            const data = req.body;
            const duplicatedEmail = await Admin.findOne({ email: data.email });
            if (duplicatedEmail) {
                return res.status(403).send({
                    message: 'This email is already registered. Please use a different email.',
                });
            }
           const instructor = new Admin({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            role: 'instructor',
          });
        await instructor.save();
        const instructorObject = instructor.toObject();
        delete instructorObject.password;
        res.status(201).send({ message: 'Instructor created successfully', instructor: instructorObject });

        }catch(error){
            console.error('Error creating instructor: ', error);
            res.status(500).send({ message: error });
        }
    }


   
}

export default AdminControlller;
