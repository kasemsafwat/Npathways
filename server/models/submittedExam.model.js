import { Schema, model } from 'mongoose';

const submittedExamSchema = new Schema(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: Number,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    responses: [
      {
        _id: false,
        question: {
          type: String,
          required: true,
        },
        selectedAnswers: [
          {
            type: String,
            required: true,
          },
        ],
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    passed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SubmittedExamModel = model('SubmittedExam', submittedExamSchema);

export default SubmittedExamModel;
