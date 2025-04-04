import { Router } from "express";
import { authentication } from "../middleware/auth.middleware.js";
import EnrollmentController from "../controllers/enrollment.controller.js";
import verifyInput from "../middleware/verify.middleware.js";

// The prefix is /api/enrollment
const router = Router();

router.get("/", EnrollmentController.getAllEnrollments);
router.get(
  "/userEnrollments",
  authentication,
  EnrollmentController.getUserEnrollments
);
router.get("/:id", EnrollmentController.getEnrollmentById);
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
  authentication,
  EnrollmentController.deleteEnrollment
);

export default router;
