import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t42mo3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('MongoDB connection error:', error);
  }
};

export default connectDB;
