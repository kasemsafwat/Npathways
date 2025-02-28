import User from '../models/user.model.js';
import Course from "../models/course.model.js";

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
            const { password, ...updateData } = req.body;

            let user = await User.findByIdAndUpdate(
            req.user._id,
            { ...updateData, image },
            { new: true }
            );

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
     },

    //  ///////////////////
    upgradeToStudent: async (req, res) => {
        try {
            const userId = req.params.userId;
            const { track, level } = req.body;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            user.track = track;
            user.level = level;
            await user.save();
            return res.status(200).send({
                message: "User upgraded to Student successfully",
                student: user
            });
    

        }catch(error){
            return res.status(500).send({
                message: 'userController: ' + error.message
            });  
        }
    },

    addCourseToStudent: async (req, res) => {
            try{
                const userId = req.params.userId;  
                const courseId = req.body.courseId;  

                const user = await User.findById(userId);
                const course = await Course.findById(courseId);


                if (!user || !course) {
                    return res.status(404).send({ message: "user or Course not found" });
                }

                user.courses.push(courseId);
                await user.save();

                return res.status(200).send({
                    message: "Course added to Student successfully",
                    student
                });

 

            }catch(error){
                return res.status(500).send({
                    message: 'userController: ' + error.message
                }); 
            }
    },

    createNewStudent:async(req,res)=>{
        try {
            const data = req.body;
            const duplicatedEmail = await User.findOne({ email: data.email });
            if (duplicatedEmail) {
                return res.status(403).send({
                    message: 'This email is already registered. Please use a different email.',
                });
            }

            const student = new User({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                courses:data.course || [],
                track:data.track,
                level:data.level,
              });
            await student.save();
            const studentObject = student.toObject();
            delete studentObject.password;
            res.status(201).send({ message: 'student created successfully', student: studentObject });
    
        }catch(error){
            console.error('Error creating Student: ', error);
            res.status(500).send({ message: error });
        }
    }

}

export default StudentControlller;
