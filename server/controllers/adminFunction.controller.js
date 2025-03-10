import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const AdminControlller = {
    deleteInstructor:async(req,res)=>{
        try {
           let {id}=req.params
           let admin=await Admin.findByIdAndDelete(id)
           if(!admin){
            return res.status(404).send({
                message:"Admin OR Instructor Not Found"
            })
           }
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
           admin.changePasswordAt = Date.now();
           console.log(admin.changePasswordAt);
           
           await admin.save()
           console.log(admin)
           res.send({
               message:"Password Update",
               admin,
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
    },
updateAdminData :async (req, res) => {
        try {
          const { adminId } = req.params;
          const updateData = req.body; 
          const admin = await Admin.findById(adminId);
          if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
          }
       if (updateData.email && updateData.email !== admin.email) {
            const duplicatedEmail = await Admin.findOne({ email: updateData.email });
            if (duplicatedEmail) {
              return res.status(403).json({
                message: 'This email is already registered. Please use a different email.',
              });
            }
          }
           if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 8);
          }
      
           const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { $set: updateData }, 
            { new: true, runValidators: true }
          );
          const updatedAdminObject = updatedAdmin.toObject();
          delete updatedAdminObject.password;
        res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdminObject });
        } catch (error) {
          console.error('Error updating admin: ', error);
          res.status(500).json({ message: error.message });  }
},


}

export default AdminControlller;
