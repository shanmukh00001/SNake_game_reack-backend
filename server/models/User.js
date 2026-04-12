import mongoose from "mongoose";

const userSchema = new mongoose.Schema(//Defines the structure of documents in MongoDB
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    highScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);