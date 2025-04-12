import express from "express";
import auhRouter from "./user.route.js";
import examRouter from "./exam.route.js";
import studentRouter from "./student.route.js";
import courseRouter from "./course.route.js";
import chatRouter from "./chat.route.js";
import userRouter from "./user.route.js";
import certificateRouter from "./certificate.route.js";
import adminRouter from "./admin.route.js";
import pathwayRouter from "./pathway.route.js";
import enrollmentRouter from "./enrollment.route.js";
import instructorRouter from "./instructor.route.js";
import paymentRouter from "./payment.route.js";
import LoginContoller from "../controllers/login.controller.js";
import verifyInput from "../middleware/verify.middleware.js";

// The prefix is /api
const router = express.Router();

router.use("/auth", auhRouter);
router.use("/exam", examRouter);
router.use("/student", studentRouter);
router.use("/course", courseRouter);
router.use("/chat", chatRouter);
router.use("/user", userRouter);
router.use("/certificate", certificateRouter);
router.use("/admin", adminRouter);
router.use("/pathway", pathwayRouter);
router.use("/enrollment", enrollmentRouter);
router.use("/instructor", instructorRouter);
router.use("/payment", paymentRouter);
router.post("/login", LoginContoller.universalLogin);
router.post("/availableEmail", verifyInput, LoginContoller.availableEmail);

export default router;
