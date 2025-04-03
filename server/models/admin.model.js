import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";
import crypto from "crypto";

const adminSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["admin", "instructor"],
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  tokens: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    trim: true,
  },
  changePasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  status: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available",
  },
});

adminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 8);
    next();
  } catch (error) {
    console.error("Admin pre save Error: ", error);
    return next(error);
  }
});

adminSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  console.log(resetToken, this.passwordResetToken);

  return resetToken;
};
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
