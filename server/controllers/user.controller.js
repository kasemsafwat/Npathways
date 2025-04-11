import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { get } from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import sendEmail from "../services/email.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import crypto from "crypto";
import CourseModel from "../models/course.model.js";
import PathwayModel from "../models/pathway.model.js";
import Instructor from "../models/instructor.model.js";
import Admin from "../models/admin.model.js";

const userController = {
  newUser: async (req, res) => {
    try {
      const data = { ...req.body, email: req.body.email.toLowerCase() };

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
      let newUser = new User(data);
      await newUser.save();
      return res.status(201).send({
        message: "Account Created Successfully",
      });
    } catch (error) {
      console.error("New User Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  // todo optimize login for universal login
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase();
      let user = await User.findOne({ email })
        .populate("pathways")
        .populate("courses");
      if (!user) {
        return res.status(404).send({
          message: "Invalid Email Or Password",
        });
      }
      let validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(404).send({
          message: "Invalid Email Or Password",
        });
      }
      let secretKey = process.env.SECRET_KEY || "secretKey";
      let token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "2d" });
      res.cookie("access_token", `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 2 * 1000,
      });

      user.tokens.push(token);

      if (user.tokens.length > 2) {
        user.tokens = user.tokens.slice(-2);
      }
      await user.save();
      // console.log("Updated User:", user);
      // console.log("Updated User:", user);
      return res.status(200).send({
        message: "Login successfully",
        token: token,
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        pathways: user.pathways,
        courses: user.courses,
      });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const userId = req.user._id;
      let users = await User.find({ _id: { $ne: userId.toString() } });
      // remove the password from the response
      users = users.map((user) => {
        let userObject = user.toObject();
        delete userObject.password;
        delete userObject.tokens;
        return userObject;
      });
      return res.status(200).send(users);
    } catch (error) {
      console.error("Get All Users Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  searchUser: async (req, res) => {
    try {
      let { search } = req.query;
      let users = await User.find({
        $and: [{ _id: { $ne: req.user._id } }],
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      });

      users = users.map((user) => {
        let userObject = user.toObject();
        delete userObject.password;
        delete userObject.tokens;
        return userObject;
      });

      return res.status(200).send(users);
    } catch (error) {
      console.error("Search User Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  getUserById: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid User ID" });
      }

      let user = await User.findById(id)
        .populate("pathways")
        .populate("courses");
      let userObject = user.toObject();
      delete userObject.password;
      delete userObject.tokens;
      return res.status(200).send(userObject);
    } catch (error) {
      console.error("Get User By Id Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },

  changUserImage: async (req, res) => {
    try {
      const userId = req.user._id;

      if (req.file) {
        const user = await User.findById(userId);
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
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { image: imageUrl },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        delete userResponse.tokens;

        return res
          .status(200)
          .json({ message: "Image updated successfully", user: userResponse });
      } else {
        return res.status(400).json({ message: "No image file provided" });
      }
    } catch (error) {
      console.error("Error in changeUserImage:", error);
      return res.status(500).json({ message: "Server error", error });
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

  // Forget Password
  forgetPassword: async (req, res) => {
    try {
      let email = req.body.email.toLowerCase();

      let user = await User.findOne({
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

      const reseUrl = `${req.protocol}://${req.headers.host}/api/auth/resetPassword/${resetToken}`;
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
      const user = await User.findOne({
        email,
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).send({ message: "User Not Found" });
      }

      user.password = password;
      user.confirmPassword = confirmPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.changePasswordAt = Date.now();

      await user.save();

      const loginToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
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
  verifyUser: async (req, res) => {
    try {
      return res.status(200).send({
        message: "User is verified",
        userId: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        user: req.user,
      });
    } catch (error) {
      console.error("Verify User Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },

  getUsersInCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.user ? req.user._id : null;

      if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      let users = await User.find({
        courses: courseId,
        _id: { $ne: userId },
      });

      users = users.map((user) => {
        let userObject = user.toObject();
        delete userObject.password;
        delete userObject.tokens;
        return userObject;
      });

      return res.status(200).send(users);
    } catch (error) {
      console.error("Get Users In Course Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  getUsersInPathway: async (req, res) => {
    try {
      const { pathwayId } = req.params;
      const userId = req.user ? req.user._id : null;

      if (!pathwayId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid pathway ID" });
      }

      const pathway = await PathwayModel.findById(pathwayId);
      if (!pathway) {
        return res.status(404).json({ error: "Pathway not found" });
      }

      let users = await User.find({
        pathways: pathwayId,
        _id: { $ne: userId },
      });

      users = users.map((user) => {
        let userObject = user.toObject();
        delete userObject.password;
        delete userObject.tokens;
        return userObject;
      });

      return res.status(200).send(users);
    } catch (error) {
      console.error("Get Users In Pathway Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
};

export default userController;
