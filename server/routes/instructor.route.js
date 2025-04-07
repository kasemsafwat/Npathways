import express from "express";
import instructorContoller from "../controllers/instructor.controller.js";
import { newInstructorValidation ,LoginInstructorValidation,UpdateInstructorValidation ,UpdateInstructorPasswordValidation ,ResetPasswordInstructorValidation} from "../middleware/instructor.middleware.js";
import { authenticationInstructor } from "../middleware/AuthInstructor.middleware.js";

import CourseController from "../controllers/course.controller.js";
import verifyInput from "../middleware/verify.middleware.js";

import { upload } from "../config/multer.storage.js";
import { userUpload } from "../middleware/userImage.middleware.js";


const router=express.Router()

router.post("/signup",newInstructorValidation,instructorContoller.newInstructor)
router.post("/login",LoginInstructorValidation,instructorContoller.Login)
router.get("/verify", authenticationInstructor, instructorContoller.verifyUser);
router.delete("/logout",authenticationInstructor,instructorContoller.logout);


// Function:
router.get("/",authenticationInstructor,instructorContoller.profile)
router.patch("/update",UpdateInstructorValidation,authenticationInstructor,instructorContoller.updateInstructor)
router.post("/updatePassword",UpdateInstructorPasswordValidation,authenticationInstructor,instructorContoller.updatePassword)

router.post(
  "/changeInstructorImage/:id",
  userUpload.single("image"),
  authenticationInstructor,
  instructorContoller.changInstructorImage
)


router.post("/forgetPassword",instructorContoller.forgetPassword);
router.patch(
  "/resetPassword/:token",
  ResetPasswordInstructorValidation,
  instructorContoller.resetPassword
);


//Instructor Permissions
//   1) Create Course()   ==>  updateMyCourse  ==> getMyCourse(T)  ==>  getCourseStudents (T)

// router.post(
//   "/courses",
//   upload.single("image"),
//   verifyInput,
//   authenticationInstructor,
//   CourseController.createCourse
// );
router.post("/courses", upload.single("image"),authenticationInstructor,instructorContoller.createCourse);
router.get("/courses", authenticationInstructor, instructorContoller.getMyCourses);

router.get('/courses/:id', authenticationInstructor, instructorContoller.getCourseStudents);

export default router;