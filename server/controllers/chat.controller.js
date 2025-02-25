import ChatModel from '../models/chat.model.js';
import UserModel from '../models/user.model.js';

class ChatController {
  static async createChat(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const newChat = await ChatModel.create({ users: [userId, id] });

      newChat.users = newChat.users.filter((user) => {
        return user.toString() !== userId.toString();
      });

      res.status(201).json(newChat);
    } catch (error) {
      console.error(`Error in chat controller create: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async accessChat(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      // console.log(id, userId);

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const user = await UserModel.findById(id);

      if (!user) return res.status(404).json({ error: 'User not found' });

      const chat = await ChatModel.find({
        $and: [
          { users: { $elemMatch: { $eq: id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      });

      if (!chat.length) return await ChatController.createChat(req, res);

      chat[0].users = chat[0].users.filter((user) => {
        return user.toString() !== userId.toString();
      });

      res.status(200).json(chat[0]);
    } catch (error) {
      console.error(`Error in chat controller: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async sendMessage(req, res) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const userId = req.user._id;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid chat ID' });
      }

      const newMessage = await ChatModel.findOneAndUpdate(
        { _id: id },
        { $push: { messages: { content: message, sender: userId } } },
        { new: true }
      );

      res.status(201).json(newMessage);
    } catch (error) {
      console.error(`Error in chat controller : ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getMessages(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid chat ID' });
      }

      const { messages, users } = await ChatModel.findById(id);

      if (!users.map((user) => user.toString()).includes(userId.toString()))
        return res.status(400).json({ error: 'Bad request' });

      res.status(200).json(messages);
    } catch (error) {
      console.error(`Error in chat controller : ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default ChatController;
