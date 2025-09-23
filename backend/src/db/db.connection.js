import mongoose from "mongoose";

const uri =
  "mongodb+srv://swapnaneel:Password%4026@cluster0.0k5ugfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectDB() {
  await mongoose.connect(uri);
  console.log("DB connected")
}
export default connectDB;
