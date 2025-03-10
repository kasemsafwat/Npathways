import ExamModel from '../models/exam.model.js';
import SubmittedExamModel from '../models/submittedExam.model.js';

class ExamController {
  static async getAllExams(req, res) {
    try {
      const exams = await ExamModel.find();
      res.status(200).json(exams);
    } catch (error) {
      console.error(`Error in exam controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getExamById(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid exam ID' });
      }

      const exam = await ExamModel.findById(id);
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }
      res.status(200).json(exam);
    } catch (error) {
      console.error(`Error in exam controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createExam(req, res) {
    try {
      const { name, questions, timeLimit } = req.body;

      for (const question of questions) {
        const trueAnswerCount = question.answers.filter(
          (answer) => answer.isCorrect
        ).length;
        if (trueAnswerCount === 0) {
          return res
            .status(400)
            .json({ error: 'At least one true answer is required' });
        }
      }

      const newExam = await ExamModel.create({
        name,
        questions,
        timeLimit,
      });
      res.status(201).json(newExam);
    } catch (error) {
      console.error(`Error in exam controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateExam(req, res) {
    try {
      const { id } = req.params;
      const { name, questions, timeLimit } = req.body;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid exam ID' });
      }

      for (const question of questions) {
        const trueAnswerCount = question.answers.filter(
          (answer) => answer.isCorrect
        ).length;
        if (trueAnswerCount === 0) {
          return res
            .status(400)
            .json({ error: 'At least one true answer is required' });
        }
      }

      const exam = await ExamModel.findById(id);
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      const updatedExam = await ExamModel.findByIdAndUpdate(
        id,
        {
          name,
          questions,
          timeLimit,
        },
        { new: true }
      );
      res.status(200).json(updatedExam);
    } catch (error) {
      console.error(`Error in exam controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteExam(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid exam ID' });
      }

      const deletedExam = await ExamModel.findByIdAndDelete(id);
      if (!deletedExam) {
        return res.status(404).json({ error: 'Exam not found' });
      }
      res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (error) {
      console.error(`Error in exam controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async submitExam(req, res) {
    try {
      const { examId, responses } = req.body;
      let unknownQuestions = 0;

      if (!examId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid exam ID' });
      }

      const exam = await ExamModel.findById(examId);

      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      const questions = exam.questions;

      const evaluatedResponses = responses
        .map((response) => {
          const question = questions.find(
            (q) => q.question === response.question
          );

          if (!question) {
            unknownQuestions++;
            return;
          }

          const selectedAnswers =
            response.selectedAnswers && response.selectedAnswers.length > 0
              ? response.selectedAnswers
              : [];
          const correctAnswers = question.answers
            .filter((ans) => ans.isCorrect)
            .map((ans) => ans.answer);
          const isCorrect =
            correctAnswers.length === selectedAnswers.length &&
            correctAnswers.every((correctAnswer) =>
              selectedAnswers.includes(correctAnswer)
            );
          return {
            question: response.question,
            selectedAnswers,
            isCorrect,
          };
        })
        .filter(
          (resp, index, self) =>
            index === self.findIndex((t) => t.question === resp.question)
        )
        .filter((resp) => resp !== undefined);

      const score = Math.round(
        (evaluatedResponses.filter((resp) => resp.isCorrect).length /
          questions.length) *
          100
      );

      const submittedExam = await SubmittedExamModel.create({
        examId,
        userId: req.user.id,
        score,
        responses: evaluatedResponses,
        passed: score >= 75,
      });

      if (!submittedExam)
        return res.status(500).json({ error: 'Could not submit exam' });

      res.status(200).json({
        message: 'Exam submitted successfully',
        score,
        responses: evaluatedResponses,
        unknownQuestions: unknownQuestions > 0 ? unknownQuestions : undefined,
      });
    } catch (error) {
      console.error(`Error in exam controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getSubmittedExams(req, res) {
    try {
      const submittedExams = await SubmittedExamModel.find({
        userId: req.user.id,
      });
      res.status(200).json(submittedExams);
    } catch (error) {
      console.error(`Error in exam controller: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default ExamController;
