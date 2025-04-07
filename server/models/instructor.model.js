import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";
import crypto from "crypto";
const instructorSchema = new Schema({
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
      image: {
        type: String,
        trim: true,
      },
      role: {
        type: String,
        default: 'instructor',
      },
        courses: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            },
        ],

},{ timestamps: true });
// Hash password before saving the instructor
instructorSchema.pre("save", async function (next) {
   try {
        if(!this.isModified("password")){
            return next();
        }
        this.password = await bcrypt.hash(this.password, 8);
        next();
   }catch(error){
        console.error("Instructor pre save Error: ", error);
        return next(error);
   }
});
const Instructor=mongoose.model("Instructor", instructorSchema);
export default Instructor; 
