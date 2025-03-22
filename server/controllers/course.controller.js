import path from "path";
import fs from "fs";
import CourseModel from "../models/course.model.js";
import SubmittedExamModel from "../models/submittedExam.model.js";
import User from "../models/user.model.js";

class CourseController {
  static async getAllCourses(req, res) {
    try {
      const courses = await CourseModel.find();
      res.status(200).json(courses);
    } catch (error) {
      console.error(`Error in course controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getCourseById(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const course = await CourseModel.findById(id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.status(200).json(course);
    } catch (error) {
      console.error(`Error in course controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createCourse(req, res) {
    try {
      const { name, description, requiredExams, instructors, lessons } =
        req.body;
      let image = "";
      if (req.file) {
        const uploadName = `${Date.now()}-${req.file.originalname}`;
        const uploadPath = path.join("uploads", uploadName);
        image = uploadName;
        fs.writeFileSync(uploadPath, req.file.buffer, (err) => {
          if (err) {
            res.status(500).json({ error: "Failed to save file" });
          }
        });
      }
      const course = await CourseModel.create({
        name,
        description,
        requiredExams,
        instructors,
        lessons,
        image,
      });
      res.status(201).json(course);
    } catch (error) {
      console.error(`Error in course controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { name, description, requiredExams, instructors, lessons } =
        req.body;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      // Get existing course to check for old image
      let course = await CourseModel.findById(id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      let image = req.body.image;
      if (req.file) {
        // Save new image
        const uploadName = `${Date.now()}-${req.file.originalname}`;
        const uploadPath = path.join("uploads", uploadName);
        image = uploadName;
        fs.writeFileSync(uploadPath, req.file.buffer, (err) => {
          if (err) {
            return res.status(500).json({ error: "Failed to save file" });
          }
        });

        // Delete old image if exists
        if (course.image) {
          const oldImagePath = path.join("uploads", course.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      course = await CourseModel.findByIdAndUpdate(
        id,
        { name, description, requiredExams, instructors, lessons, image },
        { new: true }
      );

      if (!course) {
        return res.status(404).json({ error: "Course wasn't updated" });
      }

      res.status(200).json(course);
    } catch (error) {
      console.error(`Error in course controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteCourse(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const deletedCourse = await CourseModel.findByIdAndDelete(id);
      if (!deletedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error(`Error in course controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async enrollInCourse(req, res) {
    try {
      const { courseId } = req.body;

      if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      if (req.user.courses.includes(courseId)) {
        return res.status(400).json({ error: "You already have this course" });
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      const requiredExams = course.requiredExams.map((exam) => exam.toString());

      const passedExams = await SubmittedExamModel.find({
        userId: req.user._id,
        examId: { $in: requiredExams },
        passed: true,
      })
        .select("examId")
        .then((docs) => docs.map((doc) => doc.examId.toString()));

      const unPassedExams = requiredExams.filter(
        (examId) => !passedExams.includes(examId)
      );

      if (unPassedExams.length > 0) {
        return res.status(400).json({
          error:
            "User has not passed all required exams to enroll in this course",
          examsNeeded: unPassedExams,
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { courses: courseId } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ error: "User not found, Error in token" });
      }

      res.status(200).json({ message: "Enrolled in course successfully" });
    } catch (error) {
      console.error(`Error in course controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default CourseController;
