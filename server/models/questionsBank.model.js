// import { Schema, model } from 'mongoose';

//! //! Useless for now, to be deleted
// const QuestionsBankSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     questions: [
//       {
//         question: { type: String, required: true },
//         answers: [
//           {
//             answer: { type: String, required: true },
//             isCorrect: { type: Boolean, default: false },
//           },
//         ],
//         difficulty: {
//           type: String,
//           enum: ['easy', 'medium', 'hard'],
//           default: 'medium',
//         },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const QuestionsBankModel = model('QuestionsBank', QuestionsBankSchema);

// export default QuestionsBankModel;
