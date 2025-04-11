import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
const uploadPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "uploads"
);
app.use("/uploads", express.static(uploadPath));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Server is working");
});

if (
  !process.env ||
  !process.env.SECRET_KEY ||
  !process.env.MONGO_URI ||
  !process.env.JWT_EXPIRES_IN ||
  !process.env.HOST ||
  !process.env.PORT
)
  console.error(
    "Warning: Missing environment variables, will use default values"
  );

const port = process.env.PORT || 5024;
const host = process.env.HOST || "http://localhost";

const server = app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const users = new Map();
let userNumber = 0;
io.on("connection", (socket) => {
  let userId;
  if (socket.handshake.query.userId != "no user found") {
    userId = socket.handshake.query.userId;
  } else {
    userId = `User#${++userNumber}`;
  }

  let userName;
  if (socket.handshake.query.userName != "no user found") {
    userName = socket.handshake.query.userName;
  } else {
    userName = `User#${userNumber}`;
  }
  // console.log(`${userName} connected:`, socket.id);

  socket.join("general");
  users.set(userId, socket.id);
  // console.log(`${userName} joined general chat`);

  socket.on("sendMessageToGeneral", ({ message }) => {
    // console.log(message);
    const newMessage = {
      senderId: userId,
      userName,
      content: message,
      time: new Date(),
    };

    io.to("general").emit("receiveMessageFromGeneral", newMessage);
  });

  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
    // console.log(`${userName} joined chat ${chatId}`);
  });

  socket.on("sendMessage", async ({ chatId, message }) => {
    const newMessage = {
      senderId: userId,
      userName,
      content: message,
      time: new Date(),
    };

    io.to(chatId).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    // console.log(`${userName} disconnected:`, socket.id);
    users.forEach((value, key) => {
      if (value === socket.id) users.delete(key);
    });
  });
});
