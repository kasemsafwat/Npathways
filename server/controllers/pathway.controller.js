import PathwayModel from "../models/pathway.model.js";
import CourseModel from "../models/course.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import mongoose from "mongoose";
const PathwayController = {
  createPathWay: async (req, res) => {
    try {
      const { name, courses } = req.body;
      const existingCourses = await CourseModel.find({
        _id: { $in: courses },
      });

      if (existingCourses.length !== courses.length) {
        return res.status(400).send({
          message:
            "One or more course IDs do not exist in the Course collection.",
        });
      }

      const pathway = await PathwayModel.create({
        name,
        courses,
      });

      res.status(201).send({
        message: "Pathway created successfully!",
        data: pathway,
      });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },
  getAllPathway: async (req, res) => {
    try {
      let pathways = await PathwayModel.find({}).populate(
        "courses",
        "name description requiredExams instructors lessons"
      );
      res.status(201).send({
        message: "All PathWays !",
        data: pathways,
      });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },
  // todo ==> validation
  updatePathway: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, courses } = req.body;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ error: "Invalid PathWay ID" });
      }
      const pathway = await PathwayModel.findByIdAndUpdate(
        id,
        { name, courses },
        { new: true }
      );
      if (!pathway) {
        return res.status(404).send({ error: "PathWays not found" });
      }
      res.status(200).send({
        message: "Pathway Updates successfully!",
        data: pathway,
      });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },
  deletePathWay: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid Pathway ID" });
      }
      const deletedPathWay = await PathwayModel.findByIdAndDelete(id);
      if (!deletedPathWay) {
        return res.status(404).json({ error: "PathWay not found" });
      }
      res.status(200).send({ message: "PathWay deleted successfully" });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },

  getPathwayById: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid Pathway ID" });
      }
      const Pathay = await PathwayModel.findById(id).populate(
        "courses",
        "name description requiredExams instructors lessons"
      );

      if (!Pathay) {
        return res.status(404).json({ error: "PathWay not found" });
      }
      res.status(200).send({ message: "this is pathway ", data: Pathay });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },
  addCourse: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid Pathway ID" });
      }
      let { courses } = req.body;
      let pathway = await PathwayModel.findById(id);
      if (!pathway) {
        return res.status(404).send({
          message: "Pathway Not Found",
        });
      }
      pathway.courses = [...pathway.courses, ...courses];
      await pathway.save();

      res.send({
        message: "Courses Added Successfully",
      });
    } catch (error) {
      console.error(`Error in Pathway controller: ${error}`);
      return res.status(500).send({
        message: "PathwayController: " + error.message,
      });
    }
  },

  RemoveCourse: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid Pathway ID" });
      }

      let { courses } = req.body;
      let pathway = await PathwayModel.findById(id);
      if (!pathway) {
        return res.status(404).send({
          message: "Pathway Not Found",
        });
      }
      pathway.courses = pathway.courses.filter(
        (course) => !courses.includes(course.toString())
      );
      await pathway.save();

      res.send({
        message: "Courses Removed Successfully",
      });
    } catch (error) {
      console.error(`Error in Pathway controller: ${error}`);
      return res.status(500).send({
        message: "PathwayController: " + error.message,
      });
    }
  },
  getPathwayDetails: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ error: "Invalid Pathway ID" });
      }
      const pathway = await PathwayModel.findById(id).populate({
        path: "courses",
        select: "name description requiredExams instructors lessons",
        // populate: [
        //     { path: 'instructors', select: 'firstName lastName' },
        //  ]
      });
      if (!pathway) {
        return res.status(404).send({ error: "Pathway not found" });
      }

      res.status(200).send({
        message: "Courses in the pathway",
        data: pathway.courses,
      });
    } catch (error) {
      console.error(`Error in getPathwayCourses: ${error.message}`);
      return res
        .status(500)
        .send({ message: `Server Error: ${error.message}` });
    }
  },
  getStudentsInPathway: async (req, res) => {
    try {
      const { pathwayId } = req.params;
      if (!pathwayId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ message: "Invalid Pathway ID" });
      }
      const pathway = await PathwayModel.findById(pathwayId);
      if (!pathway) {
        return res.status(404).send({ message: "Pathway not found" });
      }
      const students = await User.find({ pathways: pathwayId }).select(
        "firstName lastName email"
      );

      res.status(200).send({
        message: "Students enrolled in the pathway retrieved successfully",
        data: students,
      });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },
  enrollUserByAdmin: async (req, res) => {
    try {
      const { adminId, userId, pathwayId } = req.body;
      if (
        !userId.match(/^[0-9a-fA-F]{24}$/) &&
        !pathwayId.match(/^[0-9a-fA-F]{24}$/) &&
        !adminId.match(/^[0-9a-fA-F]{24}$/)
      ) {
        return res
          .status(400)
          .send({ message: "Invalid User ID or Pathway ID or Admin ID" });
      }
      const admin = await Admin.findById(adminId);
      if (!admin || admin.role !== "admin") {
        return res
          .status(403)
          .send({ message: "Access denied. Only admins can enroll users." });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      const pathway = await PathwayModel.findById(pathwayId);
      if (!pathway) {
        return res.status(404).send({ message: "Pathway not found" });
      }
      if (user.pathways.includes(pathwayId)) {
        return res
          .status(400)
          .send({ message: "User is already enrolled in this pathway" });
      }
      user.pathways.push(pathwayId);
      await user.save();

      res.status(200).send({
        message: "User successfully enrolled in pathway by admin",
        data: user,
      });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },

  // Student
  getAllPathwayByUser: async (req, res) => {
    try {
      let pathways = await PathwayModel.find({}).populate(
        "courses",
        "name description requiredExams instructors lessons"
      );

      res.status(201).send({
        message: "All PathWays !",
        data: pathways,
      });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },
  getPathwayByIdByUser: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ error: "Invalid Pathway ID" });
      }
      const Pathay = await PathwayModel.findById(id).populate(
        "courses",
        "name description requiredExams instructors lessons"
      );

      if (!Pathay) {
        return res.status(404).send({ error: "PathWay not found" });
      }
      res.status(200).send({ message: "this is pathway ", data: Pathay });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },

  // ////////////////
  //
  getPathwayCoursesUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ error: "Invalid Pathway ID" });
      }
      const pathway = await PathwayModel.findById(id).populate({
        path: "courses",
        select: "name description requiredExams instructors lessons",
        // populate: [
        //     { path: 'instructors', select: 'firstName lastName' },
        //  ]
      });
      if (!pathway) {
        return res.status(404).send({ error: "Pathway not found" });
      }

      res.status(200).send({
        message: "Courses in the pathway",
        data: pathway.courses,
      });
    } catch (error) {
      console.error(`Error in getPathwayCourses: ${error.message}`);
      return res
        .status(500)
        .send({ message: `Server Error: ${error.message}` });
    }
  },

  //  todo ==> (Admin or user)
  enrollUserInPathway: async (req, res) => {
    try {
      const { userId } = req.params;
      const { pathwayId } = req.body;

      if (
        !userId.match(/^[0-9a-fA-F]{24}$/) ||
        !pathwayId.match(/^[0-9a-fA-F]{24}$/)
      ) {
        return res.status(400).send({ error: "Invalid User ID or Pathway ID" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const pathway = await PathwayModel.findById(pathwayId);
      if (!pathway) {
        return res.status(404).send({ error: "Pathway not found" });
      }
      if (user.pathways.includes(pathwayId)) {
        return res
          .status(400)
          .send({ error: "User is already enrolled in this pathway" });
      }
      user.pathways.push(pathwayId);
      await user.save();

      res.status(200).send({
        message: "User enrolled in pathway successfully",
        data: user.pathways,
      });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },

  getUserPathway: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ error: "Invalid User ID" });
      }
      const user = await User.findById(userId).populate({
        path: "pathways",
        select: "name description courses",
        populate: {
          path: "courses",
          select: "name description requiredExams instructors lessons",
        },
      });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      if (user.pathways.length === 0) {
        return res.status(200).send({
          message: "User is not enrolled in any pathways",
        });
      }
      res.status(200).send({
        message: "User pathways retrieved successfully",
        data: user.pathways,
      });
    } catch (error) {
      console.error(`Error in PathWay controller: ${error}`);
      return res.status(500).send({
        message: "PathWayController: " + error.message,
      });
    }
  },
};
export default PathwayController;
