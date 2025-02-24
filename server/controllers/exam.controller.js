import ExamModel from '../models/exam.model.js';

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
}

export default ExamController;
