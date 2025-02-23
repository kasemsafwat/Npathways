import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
// 
import routes from "./routes/index.js"
import examRouter from './routes/exam.route.js';

// 
dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser())
app.use(cors());

// 
app.use('/api',routes)
// 
app.get('/', (req, res) => {
  res.send('Server is working');
});

app.use('/api/exam', examRouter);

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

let userNumber = 0;
io.on('connection', (socket) => {
  console.log(`User #${++userNumber} connected`);
  socket.on('sendMessage', (message) => {
    // console.log(message);
    io.emit('messageSent', message);
  });
  socket.on('disconnect', () => {
    // console.log('User disconnected');
  });
});
