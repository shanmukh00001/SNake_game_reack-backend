# System Architecture

## 1. Overview
The Snake Arcade application is designed with strict separation of concerns across presentation, simulation, and data persistence layers, written completely in standard JavaScript (ESM + JSX + JSDoc).

```
┌─────────────────────────────────────────────────────────────┐
│                 Client (React 19 + JavaScript + Vite)       │
│                                                             │
│  [GamePage] (React Presentation Layer)                      │
│      ├── [GameHUD] (Score, Personal Best, Speed Tier)       │
│      ├── [CanvasBoard] (Independent 60Hz Render Loop)       │
│      ├── [GameControls] (Accessible Touch D-Pad)            │
│      └── [Modals] (Ready, Pause, GameOver Dialogs)          │
│                                                             │
│  [SnakeEngine] (Framework-Independent Simulation Layer)      │
│      ├── Fixed Timestep Accumulator Loop                    │
│      ├── SeededRandom (Mulberry32 PRNG)                     │
│      ├── InputBuffer (FIFO Queue, Depth 2, Anti-180°)       │
│      ├── CollisionSystem (Bounds & Self-Hit Matrix)         │
│      ├── DifficultySystem (Progressive Speed Curves)        │
│      └── AudioEngine (Synthesized Web Audio API)            │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (Axios + JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Server (Node.js ESM + Express 5)            │
│                                                             │
│  [Routing & Security Middleware]                            │
│      ├── Helmet (CSP Headers), CORS, HPP                    │
│      └── Tiered Rate Limiters & Bot Slow Down               │
│                                                             │
│  [Controllers & Services]                                   │
│      ├── AuthController (Google OAuth ID Token Validation)  │
│      ├── ScoreController (Session Lifecycle & Scores)       │
│      └── VerificationService (Headless Simulation Replay)   │
│                                                             │
│  [MongoDB & Mongoose Models]                                │
│      ├── User (Profiles, High Scores, Providers)            │
│      ├── GameSession (Session Tokens, Seeds, Status)        │
│      ├── Score (Historical Match Records & Verified Flags)  │
│      └── PlayerStatistics (Lifetime Totals & Playtime)      │
└─────────────────────────────────────────────────────────────┘
```

## 2. Decoupled Rendering Pipeline
Unlike standard React apps that store fast-updating coordinates in `useState`, this architecture keeps the hot simulation loop entirely out of React's Virtual DOM.

1. **Simulation**: `SnakeEngine` updates snake coordinates on fixed millisecond intervals (`tickMs`).
2. **Rendering**: `CanvasBoard` runs an independent `requestAnimationFrame` loop that polls `engine.getState()` and paints pixels to the HTML5 Canvas via `CanvasRenderer`.
3. **Events**: React only listens to discrete game transitions (`onScoreChange`, `onStatusChange`, `onDie`), resulting in 0 React re-renders during active movement.

## 3. Deterministic Anti-Cheat Verification
1. When a player starts a run, the server generates a cryptographically signed session token and a 32-bit integer seed via `/api/v1/games/session/start`.
2. The client initializes `SeededRandom` using this seed.
3. Every validated turn command is recorded in an `inputLog: { tick, direction }[]`.
4. Upon game over, the client submits the final score alongside the `inputLog`.
5. The server's `GameVerificationService` runs a headless replay of the simulation using the stored session seed and input log. If the simulated score differs from the claimed score or violates physical timing limits, the submission is rejected.
