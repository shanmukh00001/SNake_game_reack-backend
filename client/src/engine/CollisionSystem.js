/**
 * Collision and spatial logic for Snake simulation.
 */
export class CollisionSystem {
  /**
   * Checks if coordinate is out of bounds [0, gridSize - 1].
   * @param {import('./Types').Coordinate} coord
   * @param {number} gridSize
   * @returns {boolean}
   */
  static isWallCollision(coord, gridSize) {
    return (
      coord.x < 0 ||
      coord.x >= gridSize ||
      coord.y < 0 ||
      coord.y >= gridSize
    );
  }

  /**
   * Checks if coordinate collides with snake body segments.
   * If willGrow is false, the current tail segment will move away and is excluded from collision.
   * @param {import('./Types').Coordinate} coord
   * @param {import('./Types').Coordinate[]} snake
   * @param {boolean} [willGrow=false]
   * @returns {boolean}
   */
  static isSelfCollision(coord, snake, willGrow = false) {
    const segmentsToCheck = willGrow ? snake : snake.slice(0, -1);
    return segmentsToCheck.some(
      (seg) => seg.x === coord.x && seg.y === coord.y
    );
  }

  /**
   * Places food in an unoccupied cell using a supplied random number generator function.
   * Returns null if no open cells remain (Win Condition).
   * @param {import('./Types').Coordinate[]} snake
   * @param {number} gridSize
   * @param {() => number} [randomFn=Math.random]
   * @returns {import('./Types').Coordinate | null}
   */
  static placeFood(snake, gridSize, randomFn = Math.random) {
    const occupied = new Set(snake.map((seg) => `${seg.x},${seg.y}`));
    const openCells = [];

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (!occupied.has(`${x},${y}`)) {
          openCells.push({ x, y });
        }
      }
    }

    if (openCells.length === 0) {
      return null;
    }

    const index = Math.floor(randomFn() * openCells.length);
    return openCells[index];
  }
}
