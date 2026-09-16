/**
 * @typedef {'UP'|'DOWN'|'LEFT'|'RIGHT'} Direction
 */

/**
 * @typedef {'READY'|'RUNNING'|'PAUSED'|'GAMEOVER'|'WON'} GameStatus
 */

/**
 * @typedef {Object} Coordinate
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} GameConfig
 * @property {number} gridSize
 * @property {number} initialTickMs
 * @property {number} minTickMs
 * @property {number} speedDeltaPerFood
 */

/**
 * @typedef {Object} InputCommand
 * @property {number} tick
 * @property {Direction} direction
 * @property {number} [timestamp]
 */

/**
 * @typedef {Object} GameOverStats
 * @property {number} score
 * @property {number} foodCount
 * @property {number} moveCount
 * @property {number} durationMs
 * @property {'wall_collision'|'self_collision'|'win'|'manual'} reason
 * @property {InputCommand[]} inputLog
 */

/**
 * @typedef {Object} GameState
 * @property {Coordinate[]} snake
 * @property {Coordinate[]} prevSnake
 * @property {Direction} direction
 * @property {Direction} prevDirection
 * @property {Coordinate|null} food
 * @property {number} score
 * @property {GameStatus} status
 * @property {number} speedLevel
 * @property {number} tickMs
 * @property {number|null} startTime
 * @property {number} moveCount
 * @property {number} foodCount
 * @property {number} interpolation
 */

/**
 * @typedef {Object} EngineEventMap
 * @property {(score: number, foodCount: number) => void} [onScoreChange]
 * @property {(status: GameStatus) => void} [onStatusChange]
 * @property {(position: Coordinate, score: number) => void} [onEat]
 * @property {(stats: GameOverStats) => void} [onDie]
 * @property {(direction: Direction) => void} [onTurn]
 * @property {(state: GameState) => void} [onStateChange]
 */

export const GAME_STATUS_ENUM = Object.freeze({
  READY: "READY",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
  GAMEOVER: "GAMEOVER",
  WON: "WON",
});
