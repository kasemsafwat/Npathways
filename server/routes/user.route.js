import express from "express";
import userController from "../controllers/user.controller.js";
import { userUpload } from "../middleware/userImage.middleware.js";
import {
  newUserValidation,
  loginValidation,
  ResetPasswordUserValidation,
} from "../middleware/user.middleware.js";
import { authentication } from "../middleware/auth.middleware.js";

// The prefix is /api/user
const router = express.Router();

router.post("/signup", newUserValidation, userController.newUser);
router.post("/login", loginValidation, userController.login);

router.post("/forgetPassword", userController.forgetPassword);
router.patch(
  "/resetPassword/:token",
  ResetPasswordUserValidation,
  userController.resetPassword
);

router.get("/all", authentication, userController.getAllUsers);
router.get("/search", authentication, userController.searchUser);
router.get("/verify", authentication, userController.verifyUser);
router.delete("/logout", userController.logout);
router.get("/:id", authentication, userController.getUserById);

// changUserImage
router.post(
  "/changUserImage/",
  userUpload.single("image"),
  authentication,
  userController.changUserImage
);

// //////////////////////
// Requested route to get all users in a course or pathway
router.get(
  "/getUsersInCourse/:courseId",
  authentication,
  userController.getUsersInCourse
);
router.get(
  "/getUsersInPathway/:pathwayId",
  authentication,
  userController.getUsersInPathway
);
// //////////////////////

// Logout

// ///////////////////

// router.delete("/:id",authentication,userController.deleteUser)
export default router;
