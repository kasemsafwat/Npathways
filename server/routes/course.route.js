import { Router } from "express";
import CourseController from "../controllers/course.controller.js";
import verifyInput from "../middleware/verify.middleware.js";
import { authentication } from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.storage.js";

// The prefix is /api/course
const router = Router();

router.get("/", CourseController.getAllCourses);
router.get("/:id", CourseController.getCourseById);
router.post(
  "/createCourse",
  upload.single("image"),
  verifyInput,
  CourseController.createCourse
);
router.put(
  "/updateCourse/:id",
  upload.single("image"),
  verifyInput,
  CourseController.updateCourse
);
router.delete("/deleteCourse/:id", CourseController.deleteCourse);

router.post("/enrollInCourse", authentication, CourseController.enrollInCourse);

export default router;
