import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

async function connectDB() {
  if(!uri) throw new Error('MONGO_URI is not defined in environment');
  await mongoose.connect(uri);
  console.log("DB connected")
}
export default connectDB;
