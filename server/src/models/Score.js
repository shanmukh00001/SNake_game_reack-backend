import mongoose from "mongoose";

/**
 * @typedef {Object} ScoreDocument
 * @property {mongoose.Types.ObjectId} userId
 * @property {mongoose.Types.ObjectId} [gameSessionId]
 * @property {number} score
 * @property {number} foodEaten
 * @property {number} movesCount
 * @property {number} durationMs
 * @property {boolean} isVerified
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    gameSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameSession",
      index: true,
    },
    score: {
      type: Number,
      required: true,
      index: true,
    },
    foodEaten: {
      type: Number,
      required: true,
      default: 0,
    },
    movesCount: {
      type: Number,
      required: true,
      default: 0,
    },
    durationMs: {
      type: Number,
      required: true,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

scoreSchema.index({ score: -1, durationMs: 1, createdAt: 1 });

const Score = mongoose.model("Score", scoreSchema);
export default Score;
export { Score };
