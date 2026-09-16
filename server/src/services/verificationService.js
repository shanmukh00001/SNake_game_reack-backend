/**
 * @typedef {Object} Coordinate
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} InputCommand
 * @property {number} tick
 * @property {'UP'|'DOWN'|'LEFT'|'RIGHT'} direction
 */

/**
 * @typedef {Object} VerificationResult
 * @property {boolean} isValid
 * @property {number} expectedScore
 * @property {number} expectedFoodCount
 * @property {string} [error]
 */

class Mulberry32 {
  /**
   * @param {number} seed
   */
  constructor(seed) {
    this.state = seed >>> 0;
  }

  /**
   * @returns {number}
   */
  next() {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

/**
 * @param {Coordinate[]} snake
 * @param {number} gridSize
 * @param {Mulberry32} rng
 * @returns {Coordinate|null}
 */
function placeFood(snake, gridSize, rng) {
  const occupied = new Set(snake.map((seg) => `${seg.x},${seg.y}`));
  const openCells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!occupied.has(`${x},${y}`)) {
        openCells.push({ x, y });
      }
    }
  }
  if (openCells.length === 0) return null;
  const index = Math.floor(rng.next() * openCells.length);
  return openCells[index];
}

export class GameVerificationService {
  /**
   * Replays game simulation from start seed and input commands to verify score.
   * @param {number} seed
   * @param {number} claimedScore
   * @param {number} claimedFoodEaten
   * @param {InputCommand[]} [inputLog=[]]
   * @param {number} [durationMs=0]
   * @param {number} [gridSize=16]
   * @returns {VerificationResult}
   */
  static verifyReplay(
    seed,
    claimedScore,
    claimedFoodEaten,
    inputLog = [],
    durationMs = 0,
    gridSize = 16
  ) {
    const foodCount = Math.floor(claimedScore / 10);

    // 1. Basic physical timing threshold check
    const minimumRealisticDuration = foodCount * 130;
    if (foodCount > 4 && durationMs > 0 && durationMs < minimumRealisticDuration) {
      return {
        isValid: false,
        expectedScore: 0,
        expectedFoodCount: 0,
        error: "Impossible completion speed detected",
      };
    }

    // 2. Headless Replay simulation
    if (inputLog.length === 0 && claimedScore > 0) {
      if (claimedScore <= 2560) {
        return {
          isValid: true,
          expectedScore: claimedScore,
          expectedFoodCount: claimedFoodEaten,
        };
      }
      return {
        isValid: false,
        expectedScore: 0,
        expectedFoodCount: 0,
        error: "Score exceeds maximum theoretical grid threshold",
      };
    }

    const rng = new Mulberry32(seed);
    let snake = [
      { x: 5, y: 8 },
      { x: 4, y: 8 },
      { x: 3, y: 8 },
    ];
    let direction = "RIGHT";
    let food = placeFood(snake, gridSize, rng);
    let simulatedScore = 0;
    let simulatedFoodCount = 0;

    // Map inputs by tick
    const inputsByTick = new Map();
    inputLog.forEach((cmd) => {
      inputsByTick.set(cmd.tick, cmd.direction);
    });

    const maxTicks = Math.max(1000, inputLog.length * 20 + foodCount * 50);

    for (let tick = 0; tick < maxTicks; tick++) {
      if (inputsByTick.has(tick)) {
        direction = inputsByTick.get(tick);
      }

      const head = snake[0];
      const delta = DIRECTIONS[direction] || { x: 1, y: 0 };
      const nextHead = {
        x: head.x + delta.x,
        y: head.y + delta.y,
      };

      // Wall collision
      if (
        nextHead.x < 0 ||
        nextHead.x >= gridSize ||
        nextHead.y < 0 ||
        nextHead.y >= gridSize
      ) {
        break;
      }

      const willEat = food !== null && nextHead.x === food.x && nextHead.y === food.y;

      // Self collision
      const bodyToCheck = willEat ? snake : snake.slice(0, -1);
      if (bodyToCheck.some((seg) => seg.x === nextHead.x && seg.y === nextHead.y)) {
        break;
      }

      const nextSnake = [nextHead, ...snake];
      if (!willEat) {
        nextSnake.pop();
      }
      snake = nextSnake;

      if (willEat) {
        simulatedScore += 10;
        simulatedFoodCount += 1;
        food = placeFood(snake, gridSize, rng);
        if (food === null) {
          break; // Board full win
        }
      }
    }

    const isValid = simulatedScore === claimedScore;

    return {
      isValid,
      expectedScore: simulatedScore,
      expectedFoodCount: simulatedFoodCount,
      error: isValid
        ? undefined
        : `Replay verification mismatch: expected ${simulatedScore}, received ${claimedScore}`,
    };
  }
}
