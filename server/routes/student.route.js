import express from "express";
import { authentication } from "../middleware/auth.middleware.js";
import StudentControlller from "../controllers/student.controller.js";

// ////Admin Authoixzation
import { protectRoutes, allowTo } from "../middleware/AuthAdmin.middleware.js";
import { UpdateUserPasswordValidation, UpdateUserValidation } from "../middleware/user.middleware.js";
 
// The prefix is /api/student
const router = express.Router();

// Admine
router
  .route("/:id")
  .delete(protectRoutes, allowTo("admin"), StudentControlller.deleteStudent);

router
  .route("/")
  .get(authentication, StudentControlller.getStudent)
  .patch(authentication ,StudentControlller.updateStudent);
router.post(
  "/update/password",
  UpdateUserPasswordValidation,
  authentication,
  StudentControlller.updatePassword
);

// /////////////////////////
// http://localhost:5024/api/student/upgrade/67bd24b18d620a7262603f09
router.post(
  "/upgrade/:userId",
  authentication,
  StudentControlller.upgradeToStudent
);
// http://localhost:5024/api/student/add-course/67bbcddfa4f2e3c840d5720f
router.post(
  "/add-course/:userId",
  authentication,
  StudentControlller.addCourseToStudent
);

export default router;
