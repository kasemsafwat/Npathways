import { Schema, model } from 'mongoose';

const ExamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    timeLimit: {
      type: Number,
      required: true,
    },
    questions: [
      {
        _id: false,
        question: { type: String, required: true },
        answers: [
          {
            _id: false,
            answer: { type: String, required: true },
            isCorrect: { type: Boolean, default: false },
          },
        ],
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
          default: 'medium',
        },
      },
    ],
  },
  { timestamps: true }
);

const ExamModel = model('Exam', ExamSchema);

export default ExamModel;
