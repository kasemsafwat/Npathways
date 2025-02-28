import express from 'express';
import authAdminController from '../controllers/authAdmin.controller.js'
import AdminControlller from '../controllers/adminFunction.controller.js'
import {newAdminValidation ,loginValidation} from "../middleware/admin.middleware.js"

import { protectRoutes  ,allowTo} from '../middleware/AuthAdmin.middleware.js';

import {CompletStudentValidation} from '../middleware/user.middleware.js';
import StudentControlller from '../controllers/student.controller.js'
const router = express.Router();



router.post('/signup',newAdminValidation,authAdminController.register)
router.post('/login',loginValidation,authAdminController.login)

// ////////////////////////////////////



// // Admine 
router.route('/:id')
    .delete(protectRoutes, allowTo('admin'),AdminControlller.deleteInstructor);

router.route("/")
     .get(protectRoutes,allowTo('admin','instructor'),AdminControlller.getprofile)
     .patch(protectRoutes,allowTo('admin','instructor'),AdminControlller.updateProfile)

router.post("/update/password",protectRoutes,allowTo('admin','instructor'),AdminControlller.updatePassword)

// /////////////////Get instructor ///////////////////////////////////////
router.get("/AllInstructor",protectRoutes,allowTo('admin'),AdminControlller.getAllInstructors)
router.get('/instructors/:id', protectRoutes,allowTo('admin'),AdminControlller.getOneInstructor);
router.post('/createNewInstructor',protectRoutes,allowTo('admin'),newAdminValidation,AdminControlller.createInstructor)
router.post('/create-NewStudent',protectRoutes,allowTo('admin'),CompletStudentValidation,StudentControlller.createNewStudent)

// ///////////Function Admin And Instructor /////////////////
export default router;
