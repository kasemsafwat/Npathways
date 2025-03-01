import Admin from '../models/admin.model.js';
import User from '../models/user.model.js';
import Course from '../models/course.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authAdminController = {
  register: async (req, res) => {
    try {
      let data = req.body;
      let dublicatedEmail = await Admin.findOne({ email: data.email });
      if (dublicatedEmail) {
        return res.status(403).send({
          message:
            'This email is already registered. Please use a different email.',
        });
      }

      const user = new Admin({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      await user.save();

      return res.status(201).send({
        message: 'Account Created Successfully',
      });
    } catch (error) {
      console.error('New Admin Error:', error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      let user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).send({
          message: 'Invalid Email Or Password',
        });
      }
      // console.log(user);
      let validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(404).send({
          message: 'Invalid Email Or Password',
        });
      }
      // console.log(validPassword);
      // let secretKey=process.env.SECRET_KEY || 'secretKey';
      // let token=await jwt.sign({id:user._id},secretKey)
      // res.cookie('access_token', `Bearer ${token}`, {
      //       httpOnly: true,
      //       maxAge: 60 * 60 * 24 * 2 * 1000,
      //  });
      // // console.log(token);
      // user.tokens.push(token);
      // await user.save();
      //  if (user.tokens.length > 2) {
      //   user.tokens = user.tokens.slice(-2);
      // }
      // await user.save();
      let secretKey = process.env.SECRET_KEY || 'secretKey';
      let token = await jwt.sign({ id: user._id, role: user.role }, secretKey);
      return res.status(200).send({
        message: 'Login successfully',
        token: token,
      });
      // res.send(user)
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },

  //  Dashboard Of Admin
  getDashboard_Admin: async (req, res) => {
    try {
      const [
        totalStudents,
        activeStudents,
        totalCourses,
        publishedCourses,
        totalInstructors,
        availableInstructors,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ status: 'active' }),
        Course.countDocuments(),
        Course.countDocuments({ status: 'published' }),
        Admin.countDocuments({ role: 'instructor' }),
        Admin.countDocuments({ role: 'instructor', status: 'available' }),
      ]);
      res.status(200).send({
        message: 'Dashboard Admin : ',
        data: {
          students: {
            total: totalStudents,
            active: activeStudents,
          },
          courses: {
            total: totalCourses,
            published: publishedCourses,
          },
          instructors: {
            total: totalInstructors,
            available: availableInstructors,
          },
        },
      });
    } catch (error) {
      res.status(500).send({
        message: 'dashboard Conts: ' + error.message,
      });
    }
  },

  // Dashboard Of Instructor
};

export default authAdminController;
