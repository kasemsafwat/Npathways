import Admin from "../models/admin.model.js";
import Instructor from "../models/instructor.model.js";
import User from "../models/user.model.js";

async function isDuplicatedEmail(newEamil, oldEmail) {
  // console.log(newEamil, oldEmail);
  if (!newEamil || newEamil === oldEmail) {
    return false;
  }
  const result = await Promise.all([
    User.findOne({ email: newEamil }),
    Instructor.findOne({ email: newEamil }),
    Admin.findOne({ email: newEamil }),
  ]).then((results) => results.some((result) => result));

  // console.log("isDuplicatedEmail", result);

  return result;
}

export default isDuplicatedEmail;
