import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Instructor from "../models/instructor.model.js";
import authAdminController from "./authAdmin.controller.js";
import instructorContoller from "./instructor.controller.js";
import bcrypt from "bcrypt";
import userController from "./user.controller.js";

const LoginContoller = {
  universalLogin: async (req, res) => {
    try {
      const { password } = req.body;
      const email = req.body.email.toLowerCase();

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Check if the user is an admin
      const admin = await Admin.findOne({ email });
      if (admin) {
        let validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
          return res.status(404).send({
            message: "Invalid Email Or Password",
          });
        }
        return authAdminController.login(req, res);
      }

      // Check if the user is an instructor
      const instructor = await Instructor.findOne({ email });
      if (instructor) {
        let validPassword = await bcrypt.compare(password, instructor.password);
        if (!validPassword) {
          return res.status(404).send({
            message: "Invalid Email Or Password",
          });
        }
        return instructorContoller.Login(req, res);
      }

      // Check if the user is a student
      const student = await User.findOne({ email });
      if (student) {
        let validPassword = await bcrypt.compare(password, student.password);
        if (!validPassword) {
          return res.status(404).send({
            message: "Invalid Email Or Password",
          });
        }
        return userController.login(req, res);
      }

      return res.status(404).send({
        message: "Invalid Email Or Password",
      });
    } catch (error) {
      console.error("Universal Login Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
};

export default LoginContoller;
