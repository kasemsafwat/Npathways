import express from "express";
import instructorContoller from "../controllers/instructor.controller.js";
import { newInstructorValidation ,LoginInstructorValidation} from "../middleware/instructor.middleware.js";
import { authenticationInstructor } from "../middleware/AuthInstructor.middleware.js";
const router=express.Router()

router.post("/signup",newInstructorValidation,instructorContoller.newInstructor)
router.post("/login",LoginInstructorValidation,instructorContoller.Login)
router.get("/verify", authenticationInstructor, instructorContoller.verifyUser);
router.delete("/logout",authenticationInstructor,instructorContoller.logout);


// Function:
router.delete("/:id",instructorContoller.deleteuser)
export default router;