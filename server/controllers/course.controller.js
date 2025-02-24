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
      const { name, requiredExams, instructors, lessons } = req.body;
      const course = await CourseModel.create({
        name,
        requiredExams,
        instructors,
        lessons,
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
      const { name, requiredExams, instructors, lessons } = req.body;

      const course = await CourseModel.findByIdAndUpdate(
        id,
        { name, requiredExams, instructors, lessons },
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
