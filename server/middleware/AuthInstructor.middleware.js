import Instructor from "../models/instructor.model.js";
import jwt from "jsonwebtoken";
export const authenticationInstructor = async (req, res, next) => {
  try {
    if (!req.cookies) {
      return res.status(401).send({
        message: "Unauthorized Instructor",
      });
    }
    let token = req?.cookies?.access_token?.split(" ")[1];
    // console.log("Token:", token);
    if (!token) {
      return res.status(401).send({
        message: "Unauthorized Instructor",
      });
    }
    let secretKey = process.env.SECRET_KEY || "secretKey";
    let valid = await jwt.verify(token, secretKey);
    // console.log("Valid:", valid);
    if (!valid) {
      return res.status(401).send({
        message: "Unauthorized Instructor",
      });
    }
    if (!valid?.id) {
      return res.status(401).send({
        message: "Unauthorized Instructor",
      });
    }
    //  console.log(valid);
    let instructor = await Instructor.findById(valid.id);
    //  console.log("Instructor:", instructor);
    if (!instructor) {
      return res.status(401).send({
        message: "Unauthorized Instructor",
      });
    }

    delete instructor.tokens;
    delete instructor.password;
    req.instructor = instructor;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(500).send({
      message: "Authentication: " + error.message,
    });
  }
};
