import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { get } from 'mongoose';

const userController = {
  newUser: async (req, res) => {
    try {
      let data = req.body;
      data.email = data.email.toLowerCase();

      let duplicateEmail = await User.findOne({ email: data.email });
      if (duplicateEmail) {
        return res.status(403).send({
          message:
            'This email is already registered. Please use a different email.',
        });
      }
      let newUser = new User(data);
      await newUser.save();
      return res.status(201).send({
        message: 'Account Created Successfully',
      });
    } catch (error) {
      console.error('New User Error:', error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase();
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({
          message: 'Invalid Email Or Password',
        });
      }
      let validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(404).send({
          message: 'Invalid Email Or Password',
        });
      }
      let secretKey = process.env.SECRET_KEY;
      let token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '2d' });
      res.cookie('access_token', `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 2 * 1000,
      });

      user.tokens.push(token);
      await user.save();
      // console.log("Updated User:", user);
      // console.log("Updated User:", user);
      return res.status(200).send({
        message: 'Login successfully',
        token: token,
      });
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      let users = await User.find();
      // remove the password from the response
      users = users.map((user) => {
        let userObject = user.toObject();
        delete userObject.password;
        delete userObject.tokens;
        return userObject;
      });
      return res.status(200).send(users);
    } catch (error) {
      console.error('Get All Users Error:', error);
      return res.status(500).send({
        message: error.message,
      });
    }
  },
  // deleteUser:async(req,res)=>{
  //     try {
  //         let {id}=req.params
  //         res.send()
  //     }catch(error){
  //         return res.status(500).send({
  //             message: error.message
  //         });
  //     }
  // }
};

export default userController;
