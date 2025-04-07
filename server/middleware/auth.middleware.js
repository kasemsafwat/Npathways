import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authentication = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    if (!req.cookies) {
      return res.status(401).send({
        message: "Unauthorized user",
      });
    }

    let token = req?.cookies?.access_token?.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Unauthorized: No token provided",
      });
    }

    let secretKey = process.env.SECRET_KEY || "secretKey";
    let valid = await jwt.verify(token, secretKey);
    if (!valid) {
      return res.status(401).send({
        message: "Unauthorized user",
      });
    }
    if (!valid?.id) {
      return res.status(401).send({
        message: "Unauthorized: Invalid token",
      });
    }
    // console.log(valid);

    let user = await User.findById(valid.id);
    if (!user) {
      return res.status(401).send({
        message: "Unauthorized user",
      });
    }
    // console.log(user);

    if (!user.tokens.includes(token)) {
      return res.status(401).send({
        message: "Unauthorized user",
      });
    }
    delete user.tokens;
    delete user.password;
    req.user = user;
    // return res.send(user)
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(500).send({
      message: "Authentication: " + error.message,
    });
  }
};
