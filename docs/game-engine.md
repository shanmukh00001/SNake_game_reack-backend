# Game Engine Architecture

## 1. Core Principles
The Snake Game engine is built to be 100% framework-independent and testable without a browser or DOM, written entirely in pure JavaScript with JSDoc typing.

### Key Components

- **`SnakeEngine.js`**: The central state machine managing game state, running the fixed-timestep loop, and orchestrating subsystems.
- **`InputBuffer.js`**: A FIFO queue (depth 2) that buffers rapid user inputs while rejecting direct 180° opposite turns against the *last queued intent*.
- **`CollisionSystem.js`**: Deterministic grid boundary detection and self-collision matrix (handling vacated tail segments cleanly).
- **`Random.js`**: A Mulberry32 PRNG ensuring that given a specific integer seed, food coordinates are generated in an identical sequence.
- **`DifficultySystem.js`**: Bounded speed curve calculating millisecond tick delays as score accumulates:
  $$\text{tickMs} = \max(\text{minTickMs}, \text{initialTickMs} - \text{foodCount} \times \text{speedDelta})$$
- **`CanvasRenderer.js`**: High-DPI 2D canvas drawing system featuring particle bursts, directional eye pupils, and reduced-motion adaptation.
- **`AudioEngine.js`**: Web Audio API oscillator synthesizer generating sound effects for movement, food consumption, game over, and victory without external audio asset downloads.

## 2. Fixed Timestep Simulation
```javascript
const tick = (now) => {
  let delta = now - this.lastTimestamp;
  this.lastTimestamp = now;

  if (delta > this.maxAccumulator) {
    delta = this.maxAccumulator; // Clamps tab-switch accumulator death spiral
  }

  this.accumulator += delta;
  const currentTickMs = DifficultySystem.calculateTickMs(this.score, this.config);

  while (this.accumulator >= currentTickMs) {
    this.accumulator -= currentTickMs;
    this.simulationStep();
  }

  this.emitStateChange();
};
```

This guarantees consistent gameplay regardless of whether the user plays on a 60Hz, 120Hz, or 240Hz display.
