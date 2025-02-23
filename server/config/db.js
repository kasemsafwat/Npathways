import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.message.includes('connect ECONNREFUSED'))
      console.error('Did you start the service of mongod?');

    process.exit(1);
  }
};

export default connectDB;
