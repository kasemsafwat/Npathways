import Instructor from "../models/instructor.model.js";

export const authenticationInstructor = async (req, res, next) => {
    try {

    }catch(error){
        console.error("Authentication Error:", error.message);
        return res.status(500).send({
          message: "Authentication: " + error.message,
        });
    }
}