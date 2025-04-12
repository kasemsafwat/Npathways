import express from "express";
import authAdminController from "../controllers/authAdmin.controller.js";
import AdminControlller from "../controllers/adminFunction.controller.js";
import {
  newAdminValidation,
  loginValidation,
  ResetValidation,
  updateUserByAdminValidation,
  updateAdminValidation,
} from "../middleware/admin.middleware.js";

import { protectRoutes, allowTo } from "../middleware/AuthAdmin.middleware.js";

import { CompletStudentValidation } from "../middleware/user.middleware.js";
import StudentControlller from "../controllers/student.controller.js";
import { userUpload } from "../middleware/userImage.middleware.js";
import userController from "../controllers/user.controller.js";
import { UpdateInstructorValidation } from "../middleware/instructor.middleware.js";

// The prefix is /api/admin
const router = express.Router();

router.post("/signup", newAdminValidation, authAdminController.register);
router.post("/login", loginValidation, authAdminController.login);

router.post("/forgetPassword", authAdminController.forgetPassword);
router.patch(
  "/resetPassword/:token",
  ResetValidation,
  authAdminController.resetPassword
);
// ////////////////////////////////////

// // Admine
router.get(
  "/getAllAdmins",
  protectRoutes,
  allowTo("admin"),
  AdminControlller.getAllAdmins
);
router.get(
  "/getAdminbyId/:id",
  protectRoutes,
  allowTo("admin"),
  AdminControlller.getAdminById
);
router.delete(
  "/:id",
  protectRoutes,
  allowTo("admin"),
  AdminControlller.deleteAdmin
);

router
  .route("/")
  .get(
    protectRoutes,
    allowTo("admin", "instructor"),
    AdminControlller.getprofile
  )
  .patch(
    protectRoutes,
    allowTo("admin", "instructor"),
    AdminControlller.updateProfile
  );

router.post(
  "/update/password",
  protectRoutes,
  allowTo("admin", "instructor"),
  AdminControlller.updatePassword
);

// /////////////////Function Use Admin  ///////////////////////////////////////
router.get(
  "/AllInstructor",
  protectRoutes,
  allowTo("admin"),
  AdminControlller.getAllInstructors
);
router.get(
  "/instructors/:id",
  protectRoutes,
  allowTo("admin"),
  AdminControlller.getOneInstructor
);
router.post(
  "/createNewInstructor",
  protectRoutes,
  allowTo("admin"),
  newAdminValidation,
  AdminControlller.createInstructor
);
router.post(
  "/createNewAdmin",
  protectRoutes,
  allowTo("admin"),
  newAdminValidation,
  AdminControlller.createAdmin
);
router.post(
  "/create-NewStudent",
  protectRoutes,
  allowTo("admin"),
  CompletStudentValidation,
  StudentControlller.createNewStudent
);

router.put(
  "/users/:userId",
  updateUserByAdminValidation,
  protectRoutes,
  allowTo("admin"),
  StudentControlller.updateUserByAdmin
);
router.put(
  "/updateData/:adminId",
  protectRoutes,
  allowTo("admin"),
  updateAdminValidation,
  AdminControlller.updateAdminData
);

// ///////////Function Admin  /////////////////

// changUserImage
router.post(
  "/changInstructorImage",
  userUpload.single("image"),
  protectRoutes,
  allowTo("instructor"),
  authAdminController.changInstructorImage
);

// ///  Dashborad
router.get(
  "/dashboard",
  protectRoutes,
  allowTo("admin"),
  authAdminController.getDashboard_Admin
);

// ////  Student

router.get(
  "/getAllStudents",
  protectRoutes,
  allowTo("admin"),
  AdminControlller.getAllStudents
);

//? /////////////////////////
router.get(
  "/getUsersInCourse/:courseId",
  protectRoutes,
  allowTo("admin"),
  userController.getUsersInCourse
);
router.get(
  "/getUsersInPathway/:pathwayId",
  protectRoutes,
  allowTo("admin"),
  userController.getUsersInPathway
);
//? /////////////////////////

router.put(
  "/instructors/:id",
  UpdateInstructorValidation,
  protectRoutes,
  allowTo("admin"),
  AdminControlller.updateInstructor
);

export default router;
