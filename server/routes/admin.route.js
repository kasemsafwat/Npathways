import express from 'express';
import authAdminController from '../controllers/authAdmin.controller.js'
import {newUserValidation ,loginValidation} from "../middleware/admin.middleware.js"
const router = express.Router();



router.post('/signup',newUserValidation,authAdminController.register)
router.post('/login',loginValidation,authAdminController.login)

export default router;
