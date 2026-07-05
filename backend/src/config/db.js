import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  mongoose.set('strictQuery', true);

  if (!uri) {
    console.warn('MONGODB_URI is not set. Continuing without a database connection for local development.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    console.log('✓ MongoDB connected successfully to:', uri);
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    console.error('Make sure MongoDB is running. Start it with: mongod');
    process.exit(1);
  }
};

export default connectDB;
