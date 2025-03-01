import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
    const conn = await mongoose.connect(uri);

    console.log(
      `MongoDB connected to ${uri.split('//')[1].split(':')[0]} Database`
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.message.includes('connect ECONNREFUSED'))
      console.error('\n\n\tDid you start the service of mongod?\n\n');

    process.exit(1);
  }
};

export default connectDB;
