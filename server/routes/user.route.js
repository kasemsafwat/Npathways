import express from 'express';
const router=express.Router()
import userController from "../controllers/user.controller.js"
import {newUserValidation} from "../middleware/auth.middleware.js" 
 

router.post('/singup',newUserValidation,userController.newUser)
router.post('/login')
export default router