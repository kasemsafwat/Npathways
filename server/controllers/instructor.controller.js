import Instructor from "../models/instructor.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const instructorContoller={
    newInstructor: async (req, res) => {
        try {
            let data = req.body;
             let duplicateEmail = await Instructor.findOne({ email: data.email });
            if (duplicateEmail) {
                return res.status(403).send({
                    message:
                        "This email is already registered. Please use a different email.",
                });
            }
            let newInstructor = new Instructor(data);
            await newInstructor.save();
            return res.status(201).send({
                message: "Account Created Successfully",
            });
        } catch (error) {
            console.error("New Instructor Error:", error);
            return res.status(500).send({
                message: error.message,
            });
        }
    },
    Login:async (req, res) => {
            try {
                let {email,password}=req.body
                let instructor = await Instructor.findOne({ email });
                if (!instructor) {
                    return res.status(404).send({
                        message: "Invalid Email Or Password",
                    });
                }
                let validPassword = await bcrypt.compare(password, instructor.password);
                if (!validPassword) {
                    return res.status(404).send({
                    message: "Invalid Email Or Password", 
                    });
                }
        let secretKey = process.env.SECRET_KEY || "secretKey";        
        let token =await jwt.sign({ id: instructor._id }, secretKey, { expiresIn: "2d" });
        res.cookie("access_token", `Bearer ${token}`, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 2 * 1000,
        });
        // console.log(token);
        
            res.send()
            }catch(error){
                console.error("Login Instructor Error:", error);
                return res.status(500).send({
                    message: error.message,
                });
            }
    },
   // LogOut
   logout: async (req, res) => {
    try {
      res.clearCookie("access_token");
      res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).send({ message: "Logout failed: " + error.message });
    }
  },
//   Verify Instructor
  verifyUser: async (req, res) => {
    try {
      return res.status(200).send({
        message: "Instructor is verified",
        instructorId: req.instructor._id,
        firstName: req.instructor.firstName,
        lastName: req.instructor.lastName,
        email: req.instructor.email,
      });
    } catch (error) {
      console.error("Verify Instructor Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
//   Function Of Instructor
        deleteuser:async (req,res)=>{
            try{
                let {id}=req.params
                res.send(id)
            }catch(error){
                console.error("delete Instructor Error:", error);
                return res.status(500).send({
                    message: error.message,
                });
            }
        }




}
export default instructorContoller;