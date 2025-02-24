import express from "express";
import userController from "../controllers/user.controller.js";
import { newUserValidation, loginValidation } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", newUserValidation, userController.newUser);
router.post("/login", loginValidation, userController.login);

export default router;