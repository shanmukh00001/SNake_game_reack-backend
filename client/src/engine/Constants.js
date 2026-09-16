/**
 * Standard grid dimension (16x16 cells)
 */
export const GRID_SIZE = 16;
export const INITIAL_TICK_MS = 160;
export const MIN_TICK_MS = 65;
export const SPEED_DELTA_PER_FOOD = 3;

/** @type {import('./Types').GameConfig} */
export const DEFAULT_CONFIG = Object.freeze({
  gridSize: GRID_SIZE,
  initialTickMs: INITIAL_TICK_MS,
  minTickMs: MIN_TICK_MS,
  speedDeltaPerFood: SPEED_DELTA_PER_FOOD,
});

/** @type {Record<import('./Types').Direction, import('./Types').Coordinate>} */
export const DIRECTIONS = Object.freeze({
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
});

/** @type {Record<import('./Types').Direction, import('./Types').Direction>} */
export const OPPOSITES = Object.freeze({
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
});

export const GAME_STATUS = Object.freeze({
  READY: "ready",
  RUNNING: "running",
  PAUSED: "paused",
  GAMEOVER: "gameover",
  WON: "won",
});

/** @type {import('./Types').Coordinate[]} */
export const INITIAL_SNAKE = Object.freeze([
  { x: 5, y: 8 },
  { x: 4, y: 8 },
  { x: 3, y: 8 },
]);
