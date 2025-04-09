import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PaymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModel",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "googlepay"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: String,
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Payment = model("Payment", PaymentSchema);
export default Payment;
