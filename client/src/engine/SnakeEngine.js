import {
  DEFAULT_CONFIG,
  DIRECTIONS,
  GAME_STATUS,
  INITIAL_SNAKE,
} from "./Constants.js";
import { InputBuffer } from "./InputBuffer.js";
import { CollisionSystem } from "./CollisionSystem.js";
import { DifficultySystem } from "./DifficultySystem.js";
import { SeededRandom } from "./Random.js";

/**
 * Pure Framework-Independent Snake Game Engine.
 * Implements a fixed-timestep simulation loop with accumulator and deterministic RNG.
 */
export class SnakeEngine {
  /**
   * @param {Object} [options={}]
   * @param {Partial<import('./Types').GameConfig>} [options.config]
   * @param {number} [options.seed]
   * @param {import('./Types').EngineEventMap} [options.events]
   */
  constructor(options = {}) {
    this.config = { ...DEFAULT_CONFIG, ...options.config };
    this.rng = new SeededRandom(
      options.seed !== undefined ? options.seed : Date.now()
    );
    this.inputBuffer = new InputBuffer(2, "RIGHT");
    this.events = options.events || {};

    /** @type {import('./Types').Coordinate[]} */
    this.snake = [];
    /** @type {import('./Types').Coordinate[]} */
    this.prevSnake = [];
    /** @type {import('./Types').Direction} */
    this.direction = "RIGHT";
    /** @type {import('./Types').Direction} */
    this.prevDirection = "RIGHT";
    /** @type {import('./Types').Coordinate|null} */
    this.food = null;
    this.score = 0;
    /** @type {import('./Types').GameStatus} */
    this.status = GAME_STATUS.READY;
    /** @type {number|null} */
    this.startTime = null;
    this.moveCount = 0;
    this.foodCount = 0;
    this.currentTick = 0;

    /** @type {import('./Types').InputCommand[]} */
    this.inputLog = [];

    // Timestep accumulator loop state
    this.animFrameId = null;
    this.lastTimestamp = 0;
    this.accumulator = 0;
    this.maxAccumulator = 500; // Clamps delta spikes on tab focus switch

    this.reset();
  }

  /**
   * @param {number} [seed]
   */
  reset(seed) {
    this.stopLoop();
    if (seed !== undefined) {
      this.rng = new SeededRandom(seed);
    }

    this.snake = INITIAL_SNAKE.map((seg) => ({ ...seg }));
    this.prevSnake = this.snake.map((seg) => ({ ...seg }));
    this.direction = "RIGHT";
    this.prevDirection = "RIGHT";
    this.score = 0;
    this.status = GAME_STATUS.READY;
    this.startTime = null;
    this.moveCount = 0;
    this.foodCount = 0;
    this.currentTick = 0;
    this.inputLog = [];
    this.accumulator = 0;
    this.lastTimestamp = 0;

    this.inputBuffer.reset("RIGHT");
    this.food = CollisionSystem.placeFood(
      this.snake,
      this.config.gridSize,
      () => this.rng.next()
    );

    this.emitStatusChange(this.status);
    this.emitStateChange();
  }

  /**
   * @returns {import('./Types').GameState}
   */
  getState() {
    const currentTickMs = DifficultySystem.calculateTickMs(
      this.score,
      this.config
    );
    return {
      snake: this.snake,
      prevSnake: this.prevSnake,
      direction: this.direction,
      prevDirection: this.prevDirection,
      food: this.food,
      score: this.score,
      status: this.status,
      speedLevel: DifficultySystem.calculateSpeedLevel(this.score),
      tickMs: currentTickMs,
      startTime: this.startTime,
      moveCount: this.moveCount,
      foodCount: this.foodCount,
      interpolation:
        this.status === GAME_STATUS.RUNNING
          ? Math.min(1, Math.max(0, this.accumulator / currentTickMs))
          : 1,
    };
  }

  /**
   * @param {import('./Types').Direction} requestedDirection
   * @returns {boolean}
   */
  handleInput(requestedDirection) {
    if (this.status === GAME_STATUS.READY) {
      this.start();
    }

    if (this.status !== GAME_STATUS.RUNNING) {
      return false;
    }

    const enqueued = this.inputBuffer.enqueue(
      requestedDirection,
      this.direction
    );
    if (enqueued) {
      this.inputLog.push({
        tick: this.currentTick,
        direction: requestedDirection,
        timestamp: Date.now(),
      });
      if (this.events.onTurn) {
        this.events.onTurn(requestedDirection);
      }
    }
    return enqueued;
  }

  start() {
    if (this.status === GAME_STATUS.RUNNING) return;
    this.status = GAME_STATUS.RUNNING;
    if (!this.startTime) {
      this.startTime = Date.now();
    }
    this.startLoop();
    this.emitStatusChange(this.status);
    this.emitStateChange();
  }

  pause() {
    if (this.status !== GAME_STATUS.RUNNING) return;
    this.status = GAME_STATUS.PAUSED;
    this.stopLoop();
    this.emitStatusChange(this.status);
    this.emitStateChange();
  }

  resume() {
    if (this.status !== GAME_STATUS.PAUSED) return;
    this.status = GAME_STATUS.RUNNING;
    this.startLoop();
    this.emitStatusChange(this.status);
    this.emitStateChange();
  }

  togglePause() {
    if (this.status === GAME_STATUS.RUNNING) {
      this.pause();
    } else if (this.status === GAME_STATUS.PAUSED) {
      this.resume();
    }
  }

  /**
   * @private
   */
  safeRequestAnimationFrame(callback) {
    if (
      typeof window !== "undefined" &&
      typeof window.requestAnimationFrame === "function"
    ) {
      return window.requestAnimationFrame(callback);
    }
    if (
      typeof globalThis !== "undefined" &&
      typeof globalThis.requestAnimationFrame === "function"
    ) {
      return globalThis.requestAnimationFrame(callback);
    }
    return setTimeout(
      () =>
        callback(
          typeof performance !== "undefined" ? performance.now() : Date.now()
        ),
      16
    );
  }

  /**
   * @private
   */
  safeCancelAnimationFrame(id) {
    if (id === null) return;
    if (
      typeof window !== "undefined" &&
      typeof window.cancelAnimationFrame === "function"
    ) {
      window.cancelAnimationFrame(id);
    } else if (
      typeof globalThis !== "undefined" &&
      typeof globalThis.cancelAnimationFrame === "function"
    ) {
      globalThis.cancelAnimationFrame(id);
    } else {
      clearTimeout(id);
    }
  }

  startLoop() {
    this.lastTimestamp =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    this.accumulator = 0;

    const tick = (now) => {
      if (this.status !== GAME_STATUS.RUNNING) {
        return;
      }

      let delta = now - this.lastTimestamp;
      this.lastTimestamp = now;

      if (delta > this.maxAccumulator) {
        delta = this.maxAccumulator;
      }

      this.accumulator += delta;
      const currentTickMs = DifficultySystem.calculateTickMs(
        this.score,
        this.config
      );

      while (this.accumulator >= currentTickMs) {
        this.accumulator -= currentTickMs;
        this.simulationStep();
        if (this.status !== GAME_STATUS.RUNNING) {
          break;
        }
      }

      this.emitStateChange();

      if (this.status === GAME_STATUS.RUNNING) {
        this.animFrameId = this.safeRequestAnimationFrame(tick);
      }
    };

    this.stopLoop();
    this.animFrameId = this.safeRequestAnimationFrame(tick);
  }

  stopLoop() {
    if (this.animFrameId !== null) {
      this.safeCancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  simulationStep() {
    if (this.status !== GAME_STATUS.RUNNING) return;

    this.currentTick += 1;
    this.prevSnake = this.snake.map((seg) => ({ ...seg }));
    this.prevDirection = this.direction;

    // Fetch next direction from input buffer
    this.direction = this.inputBuffer.dequeue(this.direction);
    this.moveCount += 1;

    const head = this.snake[0];
    const delta = DIRECTIONS[this.direction];
    const nextHead = {
      x: head.x + delta.x,
      y: head.y + delta.y,
    };

    // 1. Check Wall Collision
    if (CollisionSystem.isWallCollision(nextHead, this.config.gridSize)) {
      this.handleGameOver("wall_collision");
      return;
    }

    // 2. Check Food Collision
    const willEat =
      this.food !== null &&
      nextHead.x === this.food.x &&
      nextHead.y === this.food.y;

    // 3. Check Self Collision
    if (CollisionSystem.isSelfCollision(nextHead, this.snake, willEat)) {
      this.handleGameOver("self_collision");
      return;
    }

    // 4. Update Snake coordinates
    const nextSnake = [nextHead, ...this.snake];
    if (!willEat) {
      nextSnake.pop();
    }
    this.snake = nextSnake;

    if (willEat) {
      this.score += 10;
      this.foodCount += 1;
      this.food = CollisionSystem.placeFood(
        this.snake,
        this.config.gridSize,
        () => this.rng.next()
      );

      if (this.events.onEat) {
        this.events.onEat(nextHead, this.score);
      }
      if (this.events.onScoreChange) {
        this.events.onScoreChange(this.score, this.foodCount);
      }

      // Win condition: entire board filled
      if (this.food === null) {
        this.status = GAME_STATUS.WON;
        this.stopLoop();
        this.emitStatusChange(this.status);
        if (this.events.onDie) {
          this.events.onDie(this.getGameOverStats("win"));
        }
      }
    }
  }

  /**
   * @private
   * @param {'wall_collision'|'self_collision'|'win'|'manual'} reason
   */
  handleGameOver(reason) {
    this.status = GAME_STATUS.GAMEOVER;
    this.stopLoop();
    this.emitStatusChange(this.status);

    if (this.events.onDie) {
      this.events.onDie(this.getGameOverStats(reason));
    }
  }

  /**
   * @param {'wall_collision'|'self_collision'|'win'|'manual'} reason
   * @returns {import('./Types').GameOverStats}
   */
  getGameOverStats(reason) {
    return {
      score: this.score,
      foodCount: this.foodCount,
      moveCount: this.moveCount,
      durationMs: this.startTime ? Date.now() - this.startTime : 0,
      reason,
      inputLog: [...this.inputLog],
    };
  }

  /**
   * @returns {import('./Types').InputCommand[]}
   */
  getInputLog() {
    return [...this.inputLog];
  }

  /**
   * @param {import('./Types').EngineEventMap} events
   */
  setEventListeners(events) {
    this.events = events;
  }

  /**
   * @private
   */
  emitStateChange() {
    if (this.events.onStateChange) {
      this.events.onStateChange(this.getState());
    }
  }

  /**
   * @private
   * @param {import('./Types').GameStatus} status
   */
  emitStatusChange(status) {
    if (this.events.onStatusChange) {
      this.events.onStatusChange(status);
    }
  }

  destroy() {
    this.stopLoop();
  }
}
