import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";
import crypto from "crypto";
import { type } from "os";

const userSchema = new Schema(
  {
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
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 8,
    },
    phone: {
      type: String,
    },

    tokens: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      trim: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    level: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // //////
    certificates: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Certificate",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        acquiredAt: {
          type: Date,
          default: Date.now,
        },
        _id: false,
      },
    ],

    pathways: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pathway",
      },
    ],
    changePasswordAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    verify:{
         type:Boolean,
         default:false
    },
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 8);
    next();
  } catch (error) {
    console.error("User pre save Error: ", error);
    return next(error);
  }
});

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  console.log(resetToken, this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
