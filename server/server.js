import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
//
import routes from './routes/index.js';

//
dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

//
app.use('/api', routes);
//
app.get('/', (req, res) => {
  res.send('Server is working');
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'http://localhost';

const server = app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
});

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const users = new Map();
let userNumber = 0;
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId || `User#${++userNumber}`;
  const userName = socket.handshake.query.userName || `User#${userNumber}`;

  console.log(`${userName} connected:`, socket.id);

  socket.join('general');
  users.set(userId, socket.id);
  console.log(`${userName} joined general chat`);

  socket.on('sendMessageToGeneral', ({ message }) => {
    const newMessage = {
      senderId: userId,
      userName,
      content: message,
      time: new Date(),
    };

    io.to('general').emit('receiveMessage', newMessage);
  });

  socket.on('joinChat', ({ chatId }) => {
    socket.join(chatId);
    console.log(`${userName} joined chat ${chatId}`);
  });

  socket.on('sendMessage', async ({ chatId, message }) => {
    const newMessage = {
      senderId: userId,
      userName,
      content: message,
      time: new Date(),
    };

    io.to(chatId).emit('receiveMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log(`${userName} disconnected:`, socket.id);
    users.forEach((value, key) => {
      if (value === socket.id) users.delete(key);
    });
  });
});
