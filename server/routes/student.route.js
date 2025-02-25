import express from 'express';
import { authentication } from '../middleware/auth.middleware.js';
import StudentControlller from "../controllers/student.controller.js"
const router = express.Router();


// Admine 
// router.route("/:id")
//         .delete(authentication,StudentControlller.deleteStudent)

router.route("/")
        .get(authentication,StudentControlller.getStudent)
        .patch(authentication,StudentControlller.updateStudent)
router.post("/update/password",authentication,StudentControlller.updatePassword)

export default router;
