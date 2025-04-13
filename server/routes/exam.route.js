import { Router } from "express";
import ExamController from "../controllers/exam.controller.js";
import verifyInput from "../middleware/verify.middleware.js";
import { authentication } from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.storage.js";
import { authenticationInstructor } from "../middleware/AuthInstructor.middleware.js";

// The prefix is /api/exam
const router = Router();

router.get("/", authenticationInstructor, ExamController.getAllExams);

router.get("/submittedExams", authentication, ExamController.getSubmittedExams);
router.get(
  "/submittedExams/:id",
  authentication,
  ExamController.getSubmittedExamsById
);
router.post(
  "/submitExam",
  verifyInput,
  authentication,
  ExamController.submitExam
);

router.get("/:id", authenticationInstructor, ExamController.getExamById);
router.get("/getStudent/:id", authentication, ExamController.getExamById);
router.post(
  "/createExam",
  authenticationInstructor,
  verifyInput,
  ExamController.createExam
);
router.put(
  "/updateExam/:id",
  authenticationInstructor,
  verifyInput,
  ExamController.updateExam
);
router.delete(
  "/deleteExam/:id",
  authenticationInstructor,
  ExamController.deleteExam
);

// The sheet should have a fromat like the following:
// Question | Answer1 | Answer2 | Answer3(optional) | Answer4(optional) | CorrectAnswer | Difficulty
// The first row should be the header
// The second row should be the first question
// اللهم بلغت اللهم فاشهد
router.post(
  "/uploadQuestionsSheet/:id",
  upload.single("file"),
  authenticationInstructor,
  ExamController.uploadQuestionsSheet
);

export default router;
