import { DIRECTIONS, OPPOSITES } from "./Constants.js";

/**
 * Dedicated FIFO Input buffer that validates moves and prevents 180° suicide reversals.
 */
export class InputBuffer {
  /**
   * @param {number} [maxQueueSize=2]
   * @param {import('./Types').Direction} [initialDirection="RIGHT"]
   */
  constructor(maxQueueSize = 2, initialDirection = "RIGHT") {
    this.maxQueueSize = maxQueueSize;
    this.lastEnqueuedDirection = initialDirection;
    /** @type {import('./Types').Direction[]} */
    this.queue = [];
  }

  /**
   * @param {import('./Types').Direction} [initialDirection="RIGHT"]
   */
  reset(initialDirection = "RIGHT") {
    this.queue = [];
    this.lastEnqueuedDirection = initialDirection;
  }

  /**
   * @param {import('./Types').Direction} requestedDirection
   * @param {import('./Types').Direction} currentDirection
   * @returns {boolean}
   */
  enqueue(requestedDirection, currentDirection) {
    if (!requestedDirection || !DIRECTIONS[requestedDirection]) {
      return false;
    }

    if (this.queue.length >= this.maxQueueSize) {
      return false;
    }

    // Reference the latest intended direction to prevent 180-degree suicide turns
    const referenceDirection =
      this.queue.length > 0
        ? this.queue[this.queue.length - 1]
        : this.lastEnqueuedDirection || currentDirection;

    // Drop identical consecutive inputs
    if (requestedDirection === referenceDirection) {
      return false;
    }

    // Reject direct opposite reversal
    if (OPPOSITES[requestedDirection] === referenceDirection) {
      return false;
    }

    this.queue.push(requestedDirection);
    this.lastEnqueuedDirection = requestedDirection;
    return true;
  }

  /**
   * @param {import('./Types').Direction} currentDirection
   * @returns {import('./Types').Direction}
   */
  dequeue(currentDirection) {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      this.lastEnqueuedDirection = next;
      return next;
    }
    this.lastEnqueuedDirection = currentDirection;
    return currentDirection;
  }

  /**
   * @returns {import('./Types').Direction[]}
   */
  getQueue() {
    return [...this.queue];
  }

  clear() {
    this.queue = [];
  }
}
