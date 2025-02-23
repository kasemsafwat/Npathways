import { Router } from 'express';
import ExamController from '../controllers/exam.controller.js';
import verifyInput from '../middleware/verify.middleware.js';

// The prefix is /api/exam
const router = Router();

router.get('/', ExamController.getAllExams);
router.get('/:id', ExamController.getExamById);
router.post('/createExam', verifyInput, ExamController.createExam);
router.put('/updateExam/:id', verifyInput, ExamController.updateExam);
router.delete('/deleteExam/:id', ExamController.deleteExam);

export default router;
