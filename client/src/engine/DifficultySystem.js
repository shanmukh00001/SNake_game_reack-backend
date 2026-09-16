import { DEFAULT_CONFIG } from "./Constants.js";

/**
 * Handles progressive game speed ramping and difficulty levels.
 */
export class DifficultySystem {
  /**
   * @param {number} score
   * @param {import('./Types').GameConfig} [config=DEFAULT_CONFIG]
   * @returns {number}
   */
  static calculateTickMs(score, config = DEFAULT_CONFIG) {
    const foodCount = Math.floor(score / 10);
    const calculated =
      config.initialTickMs - foodCount * config.speedDeltaPerFood;
    return Math.max(config.minTickMs, calculated);
  }

  /**
   * @param {number} score
   * @returns {number}
   */
  static calculateSpeedLevel(score) {
    return Math.max(1, Math.floor(score / 30) + 1);
  }
}
