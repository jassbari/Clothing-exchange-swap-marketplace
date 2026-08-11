import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    // Use in-memory MongoDB for local development if the standard URI fails or is localhost
    if (mongoUri && mongoUri.includes('127.0.0.1')) {
      try {
        console.log('Attempting to connect to local MongoDB...');
        const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.log('Local MongoDB not found. Starting in-memory MongoDB Server for development...');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
      }
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host} (In-Memory or Remote)`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
