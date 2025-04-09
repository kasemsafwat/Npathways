import ExamModel from "../models/exam.model.js";
import SubmittedExamModel from "../models/submittedExam.model.js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

class ExamController {
  static async getAllExams(req, res) {
    try {
      const exams = await ExamModel.find();
      res.status(200).json(exams);
    } catch (error) {
      console.error(`Error in exam controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getExamById(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid exam ID" });
      }

      const exam = await ExamModel.findById(id);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.status(200).json(exam);
    } catch (error) {
      console.error(`Error in exam controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
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
            .json({ error: "At least one true answer is required" });
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
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateExam(req, res) {
    try {
      const { id } = req.params;
      const { name, questions, timeLimit } = req.body;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid exam ID" });
      }

      for (const question of questions) {
        const trueAnswerCount = question.answers.filter(
          (answer) => answer.isCorrect
        ).length;
        if (trueAnswerCount === 0) {
          return res
            .status(400)
            .json({ error: "At least one true answer is required" });
        }
      }

      const exam = await ExamModel.findById(id);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
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
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteExam(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid exam ID" });
      }

      const deletedExam = await ExamModel.findByIdAndDelete(id);
      if (!deletedExam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
      console.error(`Error in exam controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async submitExam(req, res) {
    try {
      const { examId, responses } = req.body;
      let unknownQuestions = 0;

      if (!examId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid exam ID" });
      }

      const exam = await ExamModel.findById(examId);

      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
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
        return res.status(500).json({ error: "Could not submit exam" });

      res.status(200).json({
        message: "Exam submitted successfully",
        score,
        responses: evaluatedResponses,
        unknownQuestions: unknownQuestions > 0 ? unknownQuestions : undefined,
      });
    } catch (error) {
      console.error(`Error in exam controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
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
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async uploadQuestionsSheet(req, res) {
    let uploadPath = "";
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/))
        return res.status(400).json({ message: "Invalid exam ID." });

      if (!req.file)
        return res.status(400).json({ message: "No file uploaded." });

      // Validate file type
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      if (fileExtension !== ".xlsx") {
        return res.status(400).json({
          message: "Invalid file format. Only .xlsx files are allowed.",
        });
      }

      const uploadName = `${Date.now()}-${req.file.originalname}`;
      uploadPath = path.join("uploads", uploadName);
      fs.writeFileSync(uploadPath, req.file.buffer, (err) => {
        if (err) return res.status(500).json({ error: "Failed to save file" });
      });

      async function parseExcel(filePath) {
        try {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.readFile(filePath);
          const worksheet = workbook.getWorksheet(1);

          if (!worksheet) {
            return "Invalid Excel file format or empty worksheet";
          }

          const questions = [];
          const errors = [];

          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            const values = row.values.slice(1);

            let [questionText, ansA, ansB, ansC, ansD, correctAns, difficulty] =
              values;

            if (!difficulty || difficulty.toString().trim() === "")
              difficulty = "medium";

            if (
              difficulty &&
              !["easy", "medium", "hard"].includes(difficulty)
            ) {
              errors.push(
                `Row ${rowNumber}: Invalid difficulty "${difficulty}". Allowed values are "easy", "medium", or "hard".`
              );
              return;
            }

            // Validate question
            if (!questionText || questionText.toString().trim() === "") {
              errors.push(`Row ${rowNumber}: Missing question text`);
              return;
            }

            if (!ansA || ansA.toString().trim() === "") {
              errors.push(`Row ${rowNumber}: Missing answer A`);
              return;
            }

            if (!ansB || ansB.toString().trim() === "") {
              errors.push(`Row ${rowNumber}: Missing answer B`);
              return;
            }

            const rawAnswers = [ansA, ansB, ansC, ansD].filter(
              (a) => a !== undefined && a !== null && a !== ""
            );

            // Validate correctAns matches at least one answer
            if (!correctAns || correctAns.toString().trim() === "") {
              errors.push(`Row ${rowNumber}: Missing correct answer`);
              return;
            }

            const correctAnsValue = correctAns.toString().trim();
            const hasMatchingCorrectAnswer = rawAnswers.some(
              (ans) => ans.toString().trim() === correctAnsValue
            );

            if (!hasMatchingCorrectAnswer) {
              errors.push(
                `Row ${rowNumber}: Correct answer "${correctAnsValue}" doesn't match any provided answer`
              );
              return;
            }

            const answers = rawAnswers.map((ans) => ({
              answer: ans.toString().trim(),
              isCorrect: ans.toString().trim() === correctAnsValue,
            }));

            questions.push({
              question: questionText.toString().trim(),
              answers,
              difficulty: difficulty?.toString().toLowerCase() || "medium",
            });
          });

          if (errors.length > 0) {
            return errors.join("\n");
          }

          return questions;
        } catch (error) {
          return "Invalid Excel file format";
        }
      }

      const formattedQuestions = await parseExcel(uploadPath);
      if (typeof formattedQuestions === "string") {
        return res.status(400).json({
          message: "Validation errors in the uploaded file",
          errors: formattedQuestions,
        });
      }

      if (!formattedQuestions || formattedQuestions.length === 0) {
        return res
          .status(400)
          .json({ message: "No valid questions found in the file." });
      }

      const exam = await ExamModel.findById(id);
      if (!exam) return res.status(404).json({ message: "Exam not found." });

      const uniqueQuestions = formattedQuestions.filter(
        (newQuestion) =>
          !exam.questions.some((existingQuestion) => {
            if (existingQuestion.question !== newQuestion.question) {
              return false;
            }

            if (
              existingQuestion.answers.length !== newQuestion.answers.length
            ) {
              return false;
            }

            const answersMatch = newQuestion.answers.every((newAnswer) => {
              return existingQuestion.answers.some(
                (existingAnswer) =>
                  existingAnswer.answer === newAnswer.answer &&
                  existingAnswer.isCorrect === newAnswer.isCorrect
              );
            });

            return answersMatch;
          })
      );

      exam.questions.push(...uniqueQuestions);
      await exam.save();

      res.json({ message: "Questions uploaded and added!", exam });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    } finally {
      // Optionally delete uploaded file after parsing
      if (req.file && uploadPath !== "")
        fs.unlinkSync(uploadPath, (err) => {
          if (err)
            console.error("Failed to delete the file after processing:", err);
        });
    }
  }
}

export default ExamController;
