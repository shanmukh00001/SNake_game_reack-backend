# 🐍 Snake Arcade — Portfolio Single-Player Game

> A high-performance, deterministic single-player Snake Game application built with React 19, JavaScript (ESM + JSX + JSDoc), HTML5 Canvas, Web Audio API, Node.js, Express, and MongoDB.

---

## 🌐 Live Demo & Preview

- **Live Web Application**: [https://snake-game-demo.vercel.app](https://snake-game-demo.vercel.app) *(Deploy link placeholder)*
- **API Endpoint**: [https://snake-game-api.onrender.com](https://snake-game-api.onrender.com) *(API service placeholder)*

```
┌─────────────────────────────────────────────────────────────┐
│                      SNAKE ARCADE HUD                       │
│  SCORE: 420          BEST: 1,280          SPEED: L5         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         [================= CANVAS ARENA =================]  │
│         │   ·   ·   ·   ·   ·   ·   ·   ·   ·   ·   ·    │  │
│         │   ·   ·   ·   ·   ·   ·   ·   ·   ·   ·   ·    │  │
│         │   ·   ·   ·   █████►  ·   ·   ·   ·   ·   ·    │  │
│         │   ·   ·   ·   █   ·   ·   ·   ·   ·   ·   ·    │  │
│         │   ·   ·   ·   ███ ·   ·   ·   ·   ◆   ·   ·    │  │
│         │   ·   ·   ·   ·   ·   ·   ·   ·   ·   ·   ·    │  │
│         [================================================]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Core Features

- **Pure Game Engine**: 100% decoupled from React and DOM APIs. Unit testable without a browser.
- **Fixed-Timestep Simulation**: Driven by `requestAnimationFrame` with a millisecond accumulator and delta clamp to ensure consistent speed across 60Hz, 120Hz, and 240Hz monitors.
- **Anti-180° Input Buffer**: 2-depth FIFO queue that buffers rapid keystrokes and validates turns against the *last queued intent*, preventing accidental suicide reversals.
- **Deterministic PRNG**: Mulberry32 pseudo-random number generator ensures reproducible food placement from a server-issued seed.
- **Decoupled 60Hz Canvas Renderer**: High-DPI Canvas 2D pipeline with `ResizeObserver` and `devicePixelRatio` scaling, eliminating Virtual DOM rerenders during active movement.
- **Synthesized Web Audio Engine**: Web Audio API oscillator synthesis (sine, square, triangle) generating audio effects without external asset downloads.
- **Deterministic Server-Side Score Verification**: The backend replays the game simulation from the start seed and input logs before accepting high scores.
- **Persistent Leaderboard & Stats**: Mongoose database models tracking lifetime games, food consumed, playtime, and global rankings.
- **Responsive Touch Controls**: Touch swipe gesture detection and on-screen D-Pad for mobile gameplay.

---

## 🏗️ System Architecture

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

---

## 🕹️ Deep Dive: Game Engine & Subsystems

### 1. Fixed-Timestep Accumulator Loop
Standard `setInterval` loops suffer from timer throttling when browser tabs lose focus, while raw `requestAnimationFrame` loops run at varying speeds depending on monitor refresh rates (60Hz vs 144Hz).

`SnakeEngine.js` uses an accumulator pattern with delta clamping:
```javascript
const tick = (now) => {
  let delta = now - this.lastTimestamp;
  this.lastTimestamp = now;

  // Clamp large deltas when switching back from another browser tab
  if (delta > this.maxAccumulator) {
    delta = this.maxAccumulator;
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

### 2. Input Buffer & Reversal Prevention
When a player rapidly presses `UP` then `LEFT` while moving `RIGHT`, checking input solely against the snake's current physical direction would allow `LEFT` (opposite of `RIGHT`), causing instant death.

`InputBuffer.js` validates requested directions against the **latest queued direction**:
```javascript
const referenceDirection =
  this.queue.length > 0
    ? this.queue[this.queue.length - 1]
    : this.lastEnqueuedDirection || currentDirection;

if (OPPOSITES[requestedDirection] === referenceDirection) {
  return false; // Direct 180° reversal rejected
}
```

### 3. Decoupled Canvas 2D Rendering
To maintain 60 FPS without garbage collection stalls or React re-renders:
- `CanvasBoard.jsx` polls `engine.getState()` directly inside `requestAnimationFrame`.
- `CanvasRenderer.js` maps logical 16x16 grid coordinates to physical pixels scaled by `window.devicePixelRatio`.
- React state only updates on discrete events (`onScoreChange`, `onStatusChange`).

---

## 🛡️ Deterministic Server-Side Score Verification

When submitting scores to the leaderboard, the server does not blindly trust client payload values.

1. **Session Issuance**: At the start of a game, `/api/games/session/start` issues a cryptographic JWT session token containing a 32-bit seed and logs a new `GameSession` document in MongoDB.
2. **Deterministic Simulation Replay**: On game over, the client submits `{ score, foodEaten, durationMs, inputLog }`.
3. **Headless Replay Verification**: `GameVerificationService.js` reconstructs the entire game trajectory tick-by-tick on Node.js using the session seed and timestamps.
4. **Guards**: Submissions are rejected if the replay diverges from the claimed score, violates minimum physical tick duration, or reuses a completed session token.

*Detailed specification: [docs/score-verification.md](file:///c:/Users/Shannu/OneDrive/Documents/snake_game/docs/score-verification.md)*

---

## 🗄️ MongoDB Data Models

- **`User`**: Google OAuth profile (`email`, `name`, `picture`, `highScore`). Indexed on `{ highScore: -1, updatedAt: 1 }`.
- **`GameSession`**: Session token, seed, status (`active`, `completed`), and timestamps. Prevents replay attacks.
- **`Score`**: Granular record per finished match (`score`, `foodEaten`, `movesCount`, `durationMs`, `isVerified`).
- **`PlayerStatistics`**: Aggregated career stats (`gamesPlayed`, `totalFoodEaten`, `totalPlaytimeMs`, `highestScore`).

---

## 🔒 Security & Validation

- **Helmet CSP**: Content Security Policy restricting script, connect, and frame origins to authorized Google OAuth and self endpoints.
- **Tiered Rate Limiting**: Dedicated rate limits for login attempts (15 per 15m), score submissions (10 per 1m), and general API traffic.
- **Slow Down Middleware**: Progressively delays rapid automated requests to mitigate brute-force attempts.
- **Zod Runtime Schema Validation**: Strict input sanitization across all REST endpoints.
- **Production Error Masking**: Stack traces suppressed in production mode.

---

## 🧪 Testing Strategy

Automated test suites verify both client engine determinism and server API contracts.

```bash
# Run Client Vitest Suite (17 unit tests)
cd client
npm test

# Run Server Vitest Suite (11 unit & integration tests)
cd server
npm test

# Build Production Client Bundle
cd client
npm run build
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB instance (Local or MongoDB Atlas cluster)

### 2. Environment Variables

Create `.env` in `server/`:
```env
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
MONGO_URI=mongodb://127.0.0.1:27017/snakeDB
JWT_SECRET=development_jwt_secret_key_32_characters_long
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5173
```

Create `.env` in `client/`:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

### 3. Running Locally

```bash
# Terminal 1: Backend Server (Node.js ESM)
cd server
npm install
npm run dev

# Terminal 2: Frontend Client (Vite)
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Set Root Directory to `client`.
2. Build Command: `npm run build`.
3. Output Directory: `dist`.
4. Add Environment Variables:
   - `VITE_API_URL`: `https://your-snake-api.onrender.com`
   - `VITE_GOOGLE_CLIENT_ID`: `your_google_oauth_client_id.apps.googleusercontent.com`

### Backend Deployment (Render / Fly.io / Railway)
1. Set Root Directory to `server`.
2. Build Command: `npm install`.
3. Start Command: `npm start` (`node src/server.js`).
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://...`
   - `JWT_SECRET`: `your_production_secret`
   - `GOOGLE_CLIENT_ID`: `your_google_client_id`
   - `FRONTEND_URL`: `https://your-snake-game.vercel.app`

---

## ⚠️ Known Limitations & Design Realities

1. **Client-Side Bot Mitigation**: Deterministic replay verification guarantees that a submitted score matches a valid simulation trajectory. However, it does not prevent an external AI bot from sending valid key inputs in real time.
2. **Offline Guest Mode**: Guest games store high scores in browser `localStorage`. To submit scores to the global MongoDB leaderboard, Google authentication is required to prevent anonymous leaderboard spam.
