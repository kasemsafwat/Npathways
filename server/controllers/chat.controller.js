import ChatModel from "../models/chat.model.js";
import UserModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";

class ChatController {
  static async createChat(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const userName = req.user.firstName + " " + req.user.lastName;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await UserModel.findById(id);

      if (!user) return res.status(404).json({ error: "User not found" });

      const newChat = await ChatModel.create({
        users: [
          { userId, userName },
          { userId: id, userName: user.firstName + " " + user.lastName },
        ],
      });

      res.status(201).json(newChat);
    } catch (error) {
      console.error(`Error in chat controller create: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createCourseChat(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const userName = req.user.firstName + " " + req.user.lastName;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const newChat = await ChatModel.create({
        users: [{ userId, userName }],
        courseId: id,
      });

      res.status(201).json(newChat);
    } catch (error) {
      console.error(`Error in chat controller create: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async accessChat(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await UserModel.findById(id);
      const course = await CourseModel.findById(id);

      if (!user && !course)
        return res.status(404).json({ error: "User or course not found" });

      if (user) {
        const chat = await ChatModel.findOne({
          $and: [{ "users.userId": id }, { "users.userId": userId }],
        });

        if (!chat) return await ChatController.createChat(req, res);

        res.status(200).json(chat);
      } else if (course) {
        const chat = await ChatModel.findOne({
          courseId: id,
        });

        if (!chat) return await ChatController.createCourseChat(req, res);

        const userExists = chat.users.some(
          (u) => u.userId.toString() === userId.toString()
        );

        if (!userExists) {
          const userName = req.user.firstName + " " + req.user.lastName;
          const updatedChat = await ChatModel.findOneAndUpdate(
            { _id: chat._id },
            {
              $push: {
                users: { userId, userName },
              },
            },
            { new: true }
          );

          return res.status(200).json(updatedChat);
        }

        res.status(200).json(chat);
      }
    } catch (error) {
      console.error(`Error in chat controller: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async sendMessage(req, res) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const userId = req.user._id;
      const userName = req.user.firstName + " " + req.user.lastName;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid chat ID" });
      }

      const newMessage = await ChatModel.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            messages: {
              content: message,
              senderId: userId,
              userName,
              time: new Date(),
            },
          },
        },
        { new: true }
      );

      if (!newMessage) return res.status(404).json({ error: "Chat not found" });

      res.status(201).json(newMessage);
    } catch (error) {
      console.error(`Error in chat controller : ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getMessages(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid chat ID" });
      }

      const chat = await ChatModel.findById(id);

      if (!chat) return res.status(404).json({ error: "Chat not found" });

      const { messages, users } = chat;

      if (
        !users.map((user) => user.userId.toString()).includes(userId.toString())
      )
        return res.status(400).json({ error: "Bad request" });

      res.status(200).json(messages);
    } catch (error) {
      console.error(`Error in chat controller : ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllChats(req, res) {
    try {
      const userId = req.user._id;

      const chats = await ChatModel.find({
        users: { $elemMatch: { userId } },
      }).populate("users.userId", "firstName lastName");

      res.status(200).json(chats);
    } catch (error) {
      console.error(`Error in chat controller : ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default ChatController;
