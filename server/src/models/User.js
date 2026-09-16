import mongoose from "mongoose";

/**
 * @typedef {Object} UserDocument
 * @property {string} email
 * @property {string} [name]
 * @property {string} [picture]
 * @property {'google'|'local'} provider
 * @property {number} highScore
 * @property {number} nameChangeCount
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["google", "local"],
      default: "google",
    },
    highScore: {
      type: Number,
      default: 0,
      index: true,
    },
    nameChangeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.index({ highScore: -1, updatedAt: 1 });

const User = mongoose.model("User", userSchema);
export default User;
export { User };
