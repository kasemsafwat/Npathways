import { Schema, model } from 'mongoose';

const chatModel = Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [
      {
        content: { type: String, trim: true },
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        time: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Chat = model('Chat', chatModel);

export default Chat;
