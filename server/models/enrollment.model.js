import { Schema, model } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      _id: false,
      country: {
        type: String,
        required: true,
      },
      city: String,
      street: String,
    },
    nationality: String,
    facultyName: String,
    GPA: Number,
    motivationLetter: {
      type: String,
      required: true,
    },
    exam: [
      {
        _id: false,
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const EnrollmentModel = model("Enrollment", EnrollmentSchema);

export default EnrollmentModel;
