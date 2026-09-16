import mongoose from "mongoose";

/**
 * @typedef {Object} PlayerStatisticsDocument
 * @property {mongoose.Types.ObjectId} userId
 * @property {number} gamesPlayed
 * @property {number} totalFoodEaten
 * @property {number} totalPlaytimeMs
 * @property {number} highestScore
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const playerStatisticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    gamesPlayed: {
      type: Number,
      default: 0,
    },
    totalFoodEaten: {
      type: Number,
      default: 0,
    },
    totalPlaytimeMs: {
      type: Number,
      default: 0,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const PlayerStatistics = mongoose.model(
  "PlayerStatistics",
  playerStatisticsSchema
);
export default PlayerStatistics;
export { PlayerStatistics };
