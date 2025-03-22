import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";
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
    //  track ==> array
    // track: [
    //   {
    //     ref: "Course"
    //  }],
    //  track ==> array
    // todo  just track array
    // track: {
    //   type: String,
    //   trim: true,
    //   enum: ['Web Development', 'Data Science', 'Mobile Development'],
    //   default: 'Web Development',
    // },
    // ],
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

const User = mongoose.model("User", userSchema);
export default User;
