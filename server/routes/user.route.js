import express from 'express';
import userController from '../controllers/user.controller.js';
import {
  newUserValidation,
  loginValidation,
} from '../middleware/user.middleware.js';
import { authentication } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', newUserValidation, userController.newUser);
router.post('/login', loginValidation, userController.login);
router.get('/all', authentication, userController.getAllUsers);
router.get('/search', authentication, userController.searchUser);
router.get('/:id', authentication, userController.getUserById);

// ///////////////////

// router.delete("/:id",authentication,userController.deleteUser)
export default router;
