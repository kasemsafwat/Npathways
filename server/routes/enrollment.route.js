import { Router } from "express";
import { authentication } from "../middleware/auth.middleware.js";
import EnrollmentController from "../controllers/enrollment.controller.js";
import verifyInput from "../middleware/verify.middleware.js";
import { authenticationInstructor } from "../middleware/AuthInstructor.middleware.js";
// The prefix is /api/enrollment
const router = Router();

router.get(
  "/",
  authenticationInstructor,
  EnrollmentController.getAllEnrollments
);
router.get(
  "/userEnrollments",
  authentication,
  EnrollmentController.getUserEnrollments
);
router.get(
  "/:id",
  authenticationInstructor,
  EnrollmentController.getEnrollmentById
);
router.post(
  "/createEnrollment",
  verifyInput,
  authentication,
  EnrollmentController.createEnrollment
);
router.put(
  "/updateEnrollment/:id",
  verifyInput,
  authentication,
  EnrollmentController.updateEnrollment
);
router.delete(
  "/deleteEnrollment/:id",
  authenticationInstructor,
  EnrollmentController.deleteEnrollment
);

export default router;
