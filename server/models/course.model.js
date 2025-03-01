import { Schema, model } from 'mongoose';

const CourseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    requiredExams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Exam',
      },
    ],
    instructors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lessons: [String],

    // ////////////////////////////
    status: {
      type: String,
      enum: ['published', 'unpublished'],
      default: 'unpublished',
    },
    // /////////////////////////////
  },
  { timestamps: true }
);

const CourseModel = model('Course', CourseSchema);

export default CourseModel;
