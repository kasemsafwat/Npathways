import { Router } from 'express';
import CourseController from '../controllers/course.controller.js';
import verifyInput from '../middleware/verify.middleware.js';

// The prefix is /api/course
const router = Router();

router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);
router.post('/createCourse', verifyInput, CourseController.createCourse);
router.put('/updateCourse/:id', verifyInput, CourseController.updateCourse);
router.delete('/deleteCourse/:id', CourseController.deleteCourse);

export default router;
