import CourseModel from '../models/course.model.js';

class CourseController {
  static async getAllCourses(req, res) {
    try {
      const courses = await CourseModel.find();
      res.status(200).json(courses);
    } catch (error) {
      console.error(`Error in course controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static async getCourseById(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid course ID' });
      }

      const course = await CourseModel.findById(id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.status(200).json(course);
    } catch (error) {
      console.error(`Error in course controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createCourse(req, res) {
    try {
      const { name, description, requiredExams, instructors, lessons, image } =
        req.body;
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
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { name, description, requiredExams, instructors, lessons, image } =
        req.body;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid course ID' });
      }

      const course = await CourseModel.findByIdAndUpdate(
        id,
        { name, description, requiredExams, instructors, lessons, image },
        { new: true }
      );
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.status(200).json(course);
    } catch (error) {
      console.error(`Error in course controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteCourse(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid course ID' });
      }

      const deletedCourse = await CourseModel.findByIdAndDelete(id);
      if (!deletedCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error(`Error in course controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default CourseController;
