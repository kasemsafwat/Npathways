import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { get } from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userController = {
  newUser: async (req, res) => {
    try {
      let data = req.body;
      data.email = data.email.toLowerCase();

      let duplicateEmail = await User.findOne({ email: data.email });
      if (duplicateEmail) {
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
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase();
      let user = await User.findOne({ email });
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
        httpOnly: false,
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

      let user = await User.findById(id);
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
  // deleteUser:async(req,res)=>{
  //     try {
  //         let {id}=req.params
  //         res.send()
  //     }catch(error){
  //         return res.status(500).send({
  //             message: error.message
  //         });
  //     }
  // }

  changUserImage: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid User ID" });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (req.file) {
        const imageUrl = `${req.file.filename}`;

        // Remove old image if it exists
        if (user.image) {
          const oldImagePath = path.join(
            __dirname,
            "../uploads",
            path.basename(user.image)
          );
          console.log("Attempting to delete:", oldImagePath);

          if (fs.existsSync(oldImagePath)) {
            try {
              fs.unlinkSync(oldImagePath);
              console.log("Old image deleted successfully");
            } catch (error) {
              console.error("Error deleting old image:", error);
            }
          } else {
            console.log("Old image not found:", oldImagePath);
          }
        }
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { image: imageUrl },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        return res
          .status(200)
          .json({ message: "Image updated successfully", user: updatedUser });
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
      req.user.tokens = req.user.tokens.filter((token) => {
        return token !== req.token;
      });
      await req.user.save();

      res.clearCookie("access_token");

      res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).send({ message: "Logout failed: " + error.message });
    }
  },
};

export default userController;
