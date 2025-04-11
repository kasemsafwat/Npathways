import EnrollmentModel from "../models/enrollment.model.js";

class EnrollmentController {
  static async getAllEnrollments(req, res) {
    try {
      const enrollments = await EnrollmentModel.find().populate({
        path: "userId",
        select: "  pathways",
        populate: {
          path: "pathways",
          select: "name",
        },
      });
      res.status(200).json(enrollments);
    } catch (error) {
      console.error(`Error in enrollment controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getUserEnrollments(req, res) {
    try {
      const userId = req.user._id;

      const enrollments = await EnrollmentModel.find({ userId });
      if (!enrollments) {
        return res.status(404).json({ error: "Enrollments not found" });
      }
      res.status(200).json(enrollments);
    } catch (error) {
      console.error(`Error in enrollment controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getEnrollmentById(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid enrollment ID" });
      }

      const enrollment = await EnrollmentModel.findById(id).populate({
        path: "userId",
        select: "  pathways",
        populate: {
          path: "pathways",
          select: "name",
        },
      });
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.status(200).json(enrollment);
    } catch (error) {
      console.error(`Error in enrollment controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createEnrollment(req, res) {
    try {
      const data = { userId: req.user._id, ...req.body };
      // Object.keys(data).forEach(key => data[key] == null && delete data[key]);
      const enrollment = await EnrollmentModel.create(data);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error(`Error in enrollment controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateEnrollment(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid enrollment ID" });
      }

      const enrollment = await EnrollmentModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.status(200).json(enrollment);
    } catch (error) {
      console.error(`Error in enrollment controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteEnrollment(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid enrollment ID" });
      }

      const deletedEnrollment = await EnrollmentModel.findByIdAndDelete(id);
      if (!deletedEnrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.status(200).json({ message: "Enrollment deleted successfully" });
    } catch (error) {
      console.error(`Error in enrollment controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default EnrollmentController;
