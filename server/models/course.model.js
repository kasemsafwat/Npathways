import { Schema, model } from "mongoose";

const CourseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredExams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
    instructors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Instructor",
      },
    ],
    lessons: [
      {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        downloadLink: { type: String },
        duration: { type: Number },
      },
    ],
    image: { type: String },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
  },
  { timestamps: true }
);

const CourseModel = model("Course", CourseSchema);

export default CourseModel;
