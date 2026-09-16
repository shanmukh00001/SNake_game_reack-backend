/**
 * Seedable Mulberry32 Pseudo-Random Number Generator.
 * Guarantees 100% deterministic numbers given a 32-bit integer seed.
 */
export class SeededRandom {
  /**
   * @param {number} [seed=Date.now()]
   */
  constructor(seed = Date.now()) {
    this.state = seed >>> 0;
  }

  /**
   * Returns a pseudorandom float between 0 (inclusive) and 1 (exclusive).
   * @returns {number}
   */
  next() {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns an integer within the range [min, max] inclusive.
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * @returns {number}
   */
  getSeed() {
    return this.state;
  }
}
