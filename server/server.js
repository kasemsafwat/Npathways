import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is working');
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const server = app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
});
