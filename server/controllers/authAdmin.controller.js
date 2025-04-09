import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import Instructor from "../models/instructor.model.js";
import Course from "../models/course.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import crypto from "crypto";
import sendEmail from "../services/email.js";

const authAdminController = {
  register: async (req, res) => {
    try {
      let data = { ...req.body, email: req.body.email.toLowerCase() };

      const isDuplicateEmail = await Promise.all([
        User.findOne({ email: data.email }),
        Instructor.findOne({ email: data.email }),
        Admin.findOne({ email: data.email }),
      ]).then((results) => results.some((result) => result));

      if (isDuplicateEmail) {
        return res.status(403).send({
          message:
            "This email is already registered. Please use a different email.",
        });
      }
      const user = new Admin({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      await user.save();

      return res.status(201).send({
        message: "Account Created Successfully",
      });
    } catch (error) {
      console.error("New Admin Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  // todo optimize login for universal login
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      let user = await Admin.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).send({
          message: "Invalid Email Or Password",
        });
      }
      // console.log(user);
      let validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(404).send({
          message: "Invalid Email Or Password",
        });
      }
      // console.log(validPassword);
      // let secretKey=process.env.SECRET_KEY || 'secretKey';
      // let token=await jwt.sign({id:user._id},secretKey)

      // // console.log(token);
      // user.tokens.push(token);
      // await user.save();
      //  if (user.tokens.length > 2) {
      //   user.tokens = user.tokens.slice(-2);
      // }
      // await user.save();
      let secretKey = process.env.SECRET_KEY || "secretKey";
      let token = await jwt.sign({ id: user._id, role: user.role }, secretKey);
      res.cookie("access_token", `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 2 * 1000,
      });
      return res.status(200).send({
        message: "Login successfully",
        token: token,
      });
      // res.send(user)
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },

  //  Dashboard Of Admin
  getDashboard_Admin: async (req, res) => {
    try {
      const [
        totalStudents,
        activeStudents,
        totalCourses,
        publishedCourses,
        totalInstructors,
        availableInstructors,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ status: "active" }),
        Course.countDocuments(),
        Course.countDocuments({ status: "published" }),
        Admin.countDocuments({ role: "instructor" }),
        Admin.countDocuments({ role: "instructor", status: "available" }),
      ]);
      res.status(200).send({
        message: "Dashboard Admin : ",
        data: {
          students: {
            total: totalStudents,
            active: activeStudents,
          },
          courses: {
            total: totalCourses,
            published: publishedCourses,
          },
          instructors: {
            total: totalInstructors,
            available: availableInstructors,
          },
        },
      });
    } catch (error) {
      res.status(500).send({
        message: "dashboard Conts: " + error.message,
      });
    }
  },

  // Dashboard Of Instructor
  //! ChangeImage Of ADMIN :
  changInstructorImage: async (req, res) => {
    try {
      const adminId = req.admin._id;

      if (req.file) {
        const user = await Admin.findById(adminId);
        const HOST = process.env.HOST || "http://localhost";
        const PORT = process.env.PORT || 5024;
        const imageUrl = `${HOST}:${PORT}/uploads/${req.file.filename}`;

        // Remove old image if it exists
        if (user.image) {
          const oldImagePath = path.join(
            __dirname,
            "../uploads",
            path.basename(user.image)
          );
          // console.log("Attempting to delete:", oldImagePath);

          if (fs.existsSync(oldImagePath)) {
            try {
              fs.unlinkSync(oldImagePath);
              // console.log("Old image deleted successfully");
            } catch (error) {
              // console.error("Error deleting old image:", error);
            }
          } else {
            // console.log("Old image not found:", oldImagePath);
          }
        }
        const updatedInstructor = await Admin.findByIdAndUpdate(
          adminId,
          { image: imageUrl },
          { new: true }
        );

        if (!updatedInstructor) {
          return res
            .status(404)
            .send({ message: "Instructor not found not found" });
        }

        const userResponse = updatedInstructor.toObject();
        delete userResponse.password;
        delete userResponse.tokens;

        return res.status(200).send({
          message: "Image updated successfully",
          user: userResponse,
        });
      } else {
        return res.status(400).send({ message: "No image file provided" });
      }
    } catch (error) {
      console.error("Error in changeInstructorImage:", error);
      return res.status(500).send({ message: "Server error", error });
    }
  },

  // Forget Password
  forgetPassword: async (req, res) => {
    try {
      let email = req.body.email.toLowerCase();
      let user = await Admin.findOne({
        email,
      });
      if (!user) {
        return res.status(404).send({
          message: "Invalid Email",
        });
      }
      const resetToken = user.createResetPasswordToken();
      console.log(resetToken);
      await user.save({ validateeforeSave: false });

      const reseUrl = `${req.protocol}://${req.headers.host}/api/admin/resetPassword/${resetToken}`;
      const message = `We have received a password reset request. please use the below link to reset password : 
    \n\n ${reseUrl} \n\n This reset Password Link will be valid only for 15 minutes `;
      console.log(reseUrl);

      try {
        await sendEmail({
          email: user.email,
          subject: "Password change request receivesd",
          message: message,
        });
        res.status(200).send({
          message: "password reset link send to the admine email",
        });
      } catch (error) {
        (user.passwordResetToken = undefined),
          (user.passwordResetExpires = undefined),
          user.save({ validateBeforeSave: false });
      }
    } catch (error) {
      console.error("Forget Password Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password, confirmPassword } = req.body;
      const email = req.body.email.toLowerCase();

      if (!email || !password || !confirmPassword) {
        return res.status(400).send({ message: "All fields are required!" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
      }

      const token = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
      const admin = await Admin.findOne({
        email,
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!admin) {
        return res.status(400).send({ message: "User Not Found" });
      }

      admin.password = password;
      admin.confirmPassword = confirmPassword;
      admin.passwordResetToken = undefined;
      admin.passwordResetExpires = undefined;
      admin.changePasswordAt = Date.now();

      await admin.save();

      const loginToken = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      return res.status(200).send({
        message: "Password reset successfully. You are now logged in!",
        token: loginToken,
      });
    } catch (error) {
      console.error("Reset Password Error:", error);
      return res.status(500).send({ message: error.message });
    }
  },
};

export default authAdminController;
