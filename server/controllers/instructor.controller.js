import Instructor from "../models/instructor.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import CourseModel from "../models/course.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import sendEmail from "../services/email.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const instructorContoller = {
  newInstructor: async (req, res) => {
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
  // todo optimize login for universal login
  Login: async (req, res) => {
    try {
      let { password } = req.body;
      let email = req.body.email.toLowerCase();

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
      let token = await jwt.sign({ id: instructor._id }, secretKey, {
        expiresIn: "2d",
      });
      res.cookie("access_token", `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 2 * 1000,
      });
      // console.log(token);

      return res.status(200).send({
        message: "Login successfully",
        token: token,
        instructorID: instructor._id,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        email: instructor.email,
      });
    } catch (error) {
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
  updateInstructor: async (req, res) => {
    try {
      const updateData = { ...req.body, email: req.body.email.toLowerCase() };
      delete updateData.password;

      // Check if the email is already in use by another instructor
      if (updateData.email && updateData.email !== req.instructor.email) {
        const isDuplicateEmail = await Promise.all([
          User.findOne({ email: updateData.email }),
          Instructor.findOne({ email: updateData.email }),
          Admin.findOne({ email: updateData.email }),
        ]).then((results) => results.some((result) => result));
        if (isDuplicateEmail) {
          return res.status(403).json({
            message:
              "This email is already registered. Please use a different email.",
          });
        }
      }

      let instructor = await Instructor.findByIdAndUpdate(
        req.instructor._id,
        updateData,
        { new: true }
      ).select("-password");
      res.send(instructor);
    } catch (error) {
      return res.status(500).send({
        message: "Instructor Controller: " + error.message,
      });
    }
  },
  updatePassword: async (req, res) => {
    try {
      let { newPassword, oldPassword } = req.body;
      let instructor = await Instructor.findById(req.instructor._id);
      let validPassword = await bcrypt.compare(
        oldPassword,
        instructor.password
      );
      if (!validPassword) {
        return res.status(403).send({
          message: "Invalid old Password",
        });
      }
      instructor.password = newPassword;
      await instructor.save();
      res.send({
        message: "Password Update",
      });
    } catch (error) {
      return res.status(500).send({
        message: "Instructor Controller: " + error.message,
      });
    }
  },
  profile: async (req, res) => {
    try {
      let instructor = await Instructor.findById(req.instructor._id);
      let instructorObject = instructor.toObject();
      delete instructorObject.password;
      delete instructorObject.tokens;
      res.send(instructorObject);
    } catch (error) {
      return res.status(500).send({
        message: "Instructor Controller: " + error.message,
      });
    }
  },

  //  Change Image
  changInstructorImage: async (req, res) => {
    try {
      const instructorId = req.instructor._id;

      if (req.file) {
        const instructor = await Instructor.findById(instructorId);

        const HOST = process.env.HOST || "http://localhost";
        const PORT = process.env.PORT || 5024;
        const imageUrl = `${HOST}:${PORT}/uploads/${req.file.filename}`;

        // Remove old image if it exists
        if (instructor.image) {
          const oldImagePath = path.join(
            __dirname,
            "../uploads",
            path.basename(instructor.image)
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
        const updatedInstructor = await Instructor.findByIdAndUpdate(
          instructorId,
          { image: imageUrl },
          { new: true }
        );

        if (!updatedInstructor) {
          return res.status(404).json({ message: "Instructor not found" });
        }

        const userResponse = updatedInstructor.toObject();
        delete userResponse.password;
        delete userResponse.tokens;

        return res.status(200).json({
          message: "Image updated successfully",
          instructor: updatedInstructor,
        });
      } else {
        return res.status(400).json({ message: "No image file provided" });
      }
    } catch (error) {
      console.error("Error in changeUserImage:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  },

  // Forget Password
  // Forget Password
  forgetPassword: async (req, res) => {
    try {
      let email = req.body.email.toLowerCase();

      let instructor = await Instructor.findOne({
        email,
      });
      if (!instructor) {
        return res.status(404).send({
          message: "Invalid Email",
        });
      }
      const resetToken = instructor.createResetPasswordToken();
      // console.log(resetToken);
      await instructor.save({ validateeforeSave: false });

      const reseUrl = `${req.protocol}://${req.headers.host}/api/instructor/resetPassword/${resetToken}`;
      const message = `We have received a password reset request. please use the below link to reset password : 
      \n\n ${reseUrl} \n\n This reset Password Link will be valid only for 15 minutes `;
      // console.log(reseUrl);

      try {
        await sendEmail({
          email: instructor.email,
          subject: "Password change request receivesd",
          message: message,
        });
        res.status(200).send({
          message: "password reset link send to the Instructor email",
        });
      } catch (error) {
        (instructor.passwordResetToken = undefined),
          (instructor.passwordResetExpires = undefined),
          instructor.save({ validateBeforeSave: false });
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

      const instructor = await Instructor.findOne({
        email,
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      });
      if (!instructor) {
        return res.status(400).send({ message: "Instructor Not Found" });
      }

      instructor.password = password;
      instructor.confirmPassword = confirmPassword;
      instructor.passwordResetToken = undefined;
      instructor.passwordResetExpires = undefined;
      instructor.changePasswordAt = Date.now();

      await instructor.save();

      const loginToken = jwt.sign(
        { id: instructor._id },
        process.env.SECRET_KEY,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
      );

      return res.status(200).send({
        message: "Password reset successfully. You are now logged in!",
        token: loginToken,
      });
    } catch (error) {
      console.error("Reset Password Error:", error);
      return res.status(500).send({ message: error.message });
    }
  },
  // Instructor Permissions
  //   1) Create Course()   ==>  updateMyCourse  ==> getMyCourse(T)  ==>  getCourseStudents (T)
  // createCourse: async (req, res) => {
  //   try {
  //     const { name, description, requiredExams } = req.body;
  //     const newCourse = new CourseModel({
  //       name,
  //       description,
  //       requiredExams,
  //       instructors: [req.instructor._id],
  //       image: req.file?.filename,
  //     });

  //     const savedCourse = await newCourse.save();
  //     await Instructor.findByIdAndUpdate(req.instructor._id, {
  //       $push: { courses: savedCourse._id },
  //     });

  //     res.status(201).json(savedCourse);
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Create Course Error: " + error.message });
  //   }
  // },
  getMyCourses: async (req, res) => {
    try {
      const courses = await CourseModel.find({
        instructors: req.instructor._id,
      }).populate("requiredExams");

      res.json(courses);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Get My Courses Error: " + error.message });
    }
  },
  // getCourseStudents: async (req, res) => {
  //   try {
  //     const courseId = req.params.id;
  //     const course = await CourseModel.findOne({
  //       _id: courseId,
  //       instructors: req.instructor._id,
  //     }).populate("students", "firstName lastName email");

  //     if (!course) {
  //       return res.status(404).json({ message: "Course not found " });
  //     }
  //     res.status(200).json({
  //       courseName: course.name,
  //       totalStudents: course.students.length,
  //       students: course.students,
  //     });
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Get Course Students Error: " + error.message });
  //   }
  // },

  //* Added these points to finish the page, feel free to edit it

  getUsersInCourse: async (req, res) => {
    try {
      const courses = await CourseModel.find({
        instructors: req.instructor._id,
      });

      if (!courses || courses.length === 0) {
        return res.status(404).json({ error: "No courses found" });
      }

      const courseIds = courses.map((course) => course._id);

      // Create a map of course IDs to course names
      const courseMap = {};
      courses.forEach((course) => {
        courseMap[course._id.toString()] = course.name;
      });

      let users = await User.find({
        courses: { $in: courseIds },
      });

      users = users.map((user) => {
        let userObject = user.toObject();
        delete userObject.password;
        delete userObject.tokens;

        // Get the course names for this user
        const userCourseNames = user.courses
          .filter((courseId) => courseMap[courseId.toString()])
          .map((courseId) => courseMap[courseId.toString()])
          .join(" & ");

        // Add course names to user object
        userObject.courseNames = userCourseNames;

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
  getAllInstructors: async (req, res) => {
    try {
      const instructors = await Instructor.find().select("-password");
      res.status(200).send(instructors);
    } catch (error) {
      console.error("Get All Instructors Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  deleteInstructor: async (req, res) => {
    try {
      const instructorId = req.params.id;
      const instructor = await Instructor.findByIdAndDelete(instructorId);
      if (!instructor) {
        return res.status(404).send({ message: "Instructor not found" });
      }
      res.status(200).send({ message: "Instructor deleted successfully" });
    } catch (error) {
      console.error("Delete Instructor Error:", error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
};
export default instructorContoller;
