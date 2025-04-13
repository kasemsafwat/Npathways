import { Schema, model } from "mongoose";

const chatModel = Schema(
  {
    users: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        userName: { type: String, trim: true },
        _id: false,
      },
    ],
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    courseName: { type: String, trim: true },
    messages: [
      {
        content: { type: String, trim: true },
        senderId: { type: Schema.Types.ObjectId, ref: "User" },
        userName: { type: String, trim: true },
        time: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Chat = model("Chat", chatModel);

export default Chat;
