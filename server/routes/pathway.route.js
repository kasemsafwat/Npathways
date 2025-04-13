import express from "express";
import { authentication } from "../middleware/auth.middleware.js";
import PathwayController from "../controllers/pathway.controller.js";
import {
  addCourseValidation,
  newPathWayValidation,
} from "../middleware/pathway.middleware.js";
import { protectRoutes, allowTo } from "../middleware/AuthAdmin.middleware.js";

// The prefix is /api/pathway
const router = express.Router();

// By Admin
router.post(
  "/admin",
  protectRoutes,
  allowTo("admin"),
  newPathWayValidation,
  PathwayController.createPathWay
);
router.get(
  "/admin",
  protectRoutes,
  allowTo("admin", "instructor"),
  PathwayController.getAllPathway
);
router.get(
  "/admin/:id",
  protectRoutes,
  allowTo("admin", "instructor"),
  PathwayController.getPathwayById
);
router.get(
  "/admin/:id/courses",
  protectRoutes,
  allowTo("admin", "instructor"),
  PathwayController.getPathwayDetails
);
router.get(
  "/admin/:pathwayId/students",
  PathwayController.getStudentsInPathway
);

router.patch(
  "/admin/:id",
  protectRoutes,
  allowTo("admin"),
  PathwayController.updatePathway
);
router.delete(
  "/admin/:id",
  protectRoutes,
  allowTo("admin"),
  PathwayController.deletePathWay
);

// todo  To Add Course  ==> make middleware
router.post(
  "/admin/:id/courses",
  protectRoutes,
  allowTo("admin"),
  addCourseValidation,
  PathwayController.addCourse
);
router.delete(
  "/admin/:id/courses",
  protectRoutes,
  allowTo("admin"),
  PathwayController.RemoveCourse
);
// added protected route for enroll user by admin
router.post(
  "/admin/enroll-Student",
  protectRoutes,
  PathwayController.enrollUserByAdmin
);
//  unenroll user by admin
router.post(
  "/admin/unEnroll-Student",
  protectRoutes,
  PathwayController.unenrollUserByAdmin
);
// //////////////////////////
// By Student
router.get("/student", authentication, PathwayController.getAllPathwayByUser);
// //////////////////////////
// we made this route to get the pathway by user id using authentication
router.get(
  "/student/userPathway",
  authentication,
  PathwayController.getUserPathway
);
//////////////////////////////
router.get(
  "/student/:id",
  authentication,
  PathwayController.getPathwayByIdByUser
);
router.get(
  "/student/:id/courses",
  authentication,
  PathwayController.getPathwayCoursesUser
);
// /api/pathway/student/:userId/pathways
router.post(
  "/student/:userId/enroll-pathway",
  PathwayController.enrollUserInPathway
);
// /api/student/:userId/pathways
router.get("/student/:userId/pathways", PathwayController.getUserPathway);

export default router;
