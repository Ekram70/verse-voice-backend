import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uri5m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
