import mongoose from "mongoose";

/**
 * @typedef {Object} GameSessionDocument
 * @property {mongoose.Types.ObjectId} userId
 * @property {string} sessionToken
 * @property {number} seed
 * @property {'active'|'completed'|'flagged'|'aborted'} status
 * @property {Date} startedAt
 * @property {Date} [endedAt]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const gameSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    seed: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "flagged", "aborted"],
      default: "active",
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

gameSessionSchema.index({ userId: 1, status: 1 });

const GameSession = mongoose.model("GameSession", gameSessionSchema);
export default GameSession;
export { GameSession };
