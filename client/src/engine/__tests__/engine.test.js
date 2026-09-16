import { describe, it, expect, beforeEach } from "vitest";
import { SnakeEngine } from "../SnakeEngine.js";
import { InputBuffer } from "../InputBuffer.js";
import { CollisionSystem } from "../CollisionSystem.js";
import { DifficultySystem } from "../DifficultySystem.js";
import { SeededRandom } from "../Random.js";
import {
  GAME_STATUS,
  GRID_SIZE,
  INITIAL_TICK_MS,
  MIN_TICK_MS,
} from "../Constants.js";

describe("InputBuffer - FIFO Queue & Anti-180° Protection", () => {
  let inputBuffer;

  beforeEach(() => {
    inputBuffer = new InputBuffer(2, "RIGHT");
  });

  it("accepts valid orthogonal turns", () => {
    expect(inputBuffer.enqueue("UP", "RIGHT")).toBe(true);
    expect(inputBuffer.dequeue("RIGHT")).toBe("UP");
  });

  it("rejects direct 180-degree reversal", () => {
    expect(inputBuffer.enqueue("LEFT", "RIGHT")).toBe(false);
    expect(inputBuffer.dequeue("RIGHT")).toBe("RIGHT");
  });

  it("preserves rapid sequence: Right -> Up -> Left with queue depth", () => {
    // Current moving RIGHT
    expect(inputBuffer.enqueue("UP", "RIGHT")).toBe(true);
    expect(inputBuffer.enqueue("LEFT", "RIGHT")).toBe(true);
    // Dequeues in exact FIFO order
    expect(inputBuffer.dequeue("RIGHT")).toBe("UP");
    expect(inputBuffer.dequeue("UP")).toBe("LEFT");
  });

  it("rejects rapid double-key 180-degree reversal (UP then DOWN while moving RIGHT)", () => {
    expect(inputBuffer.enqueue("UP", "RIGHT")).toBe(true);
    expect(inputBuffer.enqueue("DOWN", "RIGHT")).toBe(false); // DOWN is opposite to queued UP
    expect(inputBuffer.dequeue("RIGHT")).toBe("UP");
  });

  it("limits queue depth to max size (2)", () => {
    expect(inputBuffer.enqueue("UP", "RIGHT")).toBe(true);
    expect(inputBuffer.enqueue("LEFT", "RIGHT")).toBe(true);
    expect(inputBuffer.enqueue("DOWN", "RIGHT")).toBe(false);
  });
});

describe("CollisionSystem & Bounds", () => {
  it("detects wall collisions correctly", () => {
    expect(CollisionSystem.isWallCollision({ x: -1, y: 5 }, 16)).toBe(true);
    expect(CollisionSystem.isWallCollision({ x: 16, y: 5 }, 16)).toBe(true);
    expect(CollisionSystem.isWallCollision({ x: 5, y: -1 }, 16)).toBe(true);
    expect(CollisionSystem.isWallCollision({ x: 5, y: 16 }, 16)).toBe(true);
    expect(CollisionSystem.isWallCollision({ x: 8, y: 8 }, 16)).toBe(false);
  });

  it("detects self collision on body", () => {
    const snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
    ];
    expect(CollisionSystem.isSelfCollision({ x: 4, y: 6 }, snake, false)).toBe(
      true
    );
    // Vacated tail is safe if not growing
    expect(CollisionSystem.isSelfCollision({ x: 5, y: 6 }, snake, false)).toBe(
      false
    );
    // Vacated tail is NOT safe if growing
    expect(CollisionSystem.isSelfCollision({ x: 5, y: 6 }, snake, true)).toBe(
      true
    );
  });

  it("never places food on occupied snake tiles", () => {
    const fullBoard = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (x === 0 && y === 0) continue; // Only (0,0) open
        fullBoard.push({ x, y });
      }
    }
    const food = CollisionSystem.placeFood(fullBoard, GRID_SIZE, () => 0.5);
    expect(food).toEqual({ x: 0, y: 0 });
  });
});

describe("SeededRandom Determinism", () => {
  it("generates identical sequence given same seed", () => {
    const rng1 = new SeededRandom(12345);
    const rng2 = new SeededRandom(12345);

    for (let i = 0; i < 20; i++) {
      expect(rng1.next()).toBe(rng2.next());
    }
  });

  it("generates different sequence given different seed", () => {
    const rng1 = new SeededRandom(12345);
    const rng2 = new SeededRandom(67890);
    const seq1 = Array.from({ length: 5 }, () => rng1.next());
    const seq2 = Array.from({ length: 5 }, () => rng2.next());
    expect(seq1).not.toEqual(seq2);
  });
});

describe("SnakeEngine - Core Rules & Movement", () => {
  it("initializes with correct default state", () => {
    const engine = new SnakeEngine({ seed: 42 });
    const state = engine.getState();
    expect(state.status).toBe(GAME_STATUS.READY);
    expect(state.score).toBe(0);
    expect(state.snake.length).toBe(3);
    expect(state.direction).toBe("RIGHT");
    expect(state.food).toBeDefined();
    engine.destroy();
  });

  it("advances snake one cell on simulation step", () => {
    const engine = new SnakeEngine({ seed: 42 });
    engine.start();
    const initialHead = { ...engine.snake[0] };
    engine.simulationStep();
    expect(engine.snake[0]).toEqual({
      x: initialHead.x + 1,
      y: initialHead.y,
    });
    engine.destroy();
  });

  it("triggers gameover on wall collision", () => {
    const engine = new SnakeEngine();
    engine.snake = [
      { x: 15, y: 8 },
      { x: 14, y: 8 },
      { x: 13, y: 8 },
    ];
    engine.direction = "RIGHT";
    engine.status = GAME_STATUS.RUNNING;

    engine.simulationStep();
    expect(engine.status).toBe(GAME_STATUS.GAMEOVER);
    engine.destroy();
  });

  it("grows snake and increments score on food consumption", () => {
    const engine = new SnakeEngine({ seed: 42 });
    engine.snake = [
      { x: 4, y: 8 },
      { x: 3, y: 8 },
      { x: 2, y: 8 },
    ];
    engine.direction = "RIGHT";
    engine.food = { x: 5, y: 8 };
    engine.status = GAME_STATUS.RUNNING;

    engine.simulationStep();
    expect(engine.score).toBe(10);
    expect(engine.snake.length).toBe(4);
    expect(engine.snake[0]).toEqual({ x: 5, y: 8 });
    engine.destroy();
  });

  it("handles pause and resume transitions", () => {
    const engine = new SnakeEngine();
    engine.start();
    expect(engine.status).toBe(GAME_STATUS.RUNNING);
    engine.pause();
    expect(engine.status).toBe(GAME_STATUS.PAUSED);
    engine.resume();
    expect(engine.status).toBe(GAME_STATUS.RUNNING);
    engine.destroy();
  });

  it("records input log commands during gameplay", () => {
    const engine = new SnakeEngine();
    engine.start();
    engine.handleInput("DOWN");
    const log = engine.getInputLog();
    expect(log.length).toBe(1);
    expect(log[0].direction).toBe("DOWN");
    engine.destroy();
  });
});

describe("DifficultySystem", () => {
  it("calculates progressive tick speed bounded by minimum", () => {
    expect(DifficultySystem.calculateTickMs(0)).toBe(INITIAL_TICK_MS);
    expect(DifficultySystem.calculateTickMs(100)).toBe(
      INITIAL_TICK_MS - 10 * 3
    );
    expect(DifficultySystem.calculateTickMs(10000)).toBe(MIN_TICK_MS);
  });
});
