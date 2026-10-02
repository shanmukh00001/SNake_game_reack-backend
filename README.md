# 🐍 Snake Arcade — Deterministic Full-Stack Web Game

> An esports-grade, anti-cheat verified Snake arcade web application crafted with **React 19**, **Vite**, **Tailwind CSS**, **HTML5 Canvas 2D**, **Node.js (ESM)**, **Express 5**, and **MongoDB**.

[![CI Pipeline](https://github.com/shanmukh00001/SNake_game_reack-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/shanmukh00001/SNake_game_reack-backend/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-emerald.svg)](LICENSE)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow.svg)](https://vitest.dev)

---

## 🎮 Features at a Glance

- **Deterministic 60 FPS Canvas Engine:** Smooth, hardware-accelerated 2D rendering on a 16x16 coordinate matrix with sub-pixel grid styling and gradient emerald snake body.
- **Cryptographic Anti-Cheat & Replay Verifier:** Server-authoritative replay simulation (`Mulberry32 PRNG`) that validates the entire match tick-by-tick before accepting any high score.
- **2-Slot FIFO Input Buffer:** Eliminates accidental 180° self-destruction suicide while preserving rapid multi-turn sequences.
- **Tactile "Obsidian Arcade" Aesthetic:** Deep void tones (`#090A0C`), vibrant phosphor emeralds (`#10B981`), terracotta food pellets (`#C45643`), and high-contrast telemetry pods.
- **Procedural Web Audio API Sound FX:** Zero-latency procedural synthesis for food pickup blips, speedup chimes, and crash effects.
- **Dual Authentication Modes:** Play immediately in **Guest Mode** with local score caching, or sign in via **Google OAuth 2.0** to claim your rank on the global leaderboard.
- **Responsive Cockpit Layout:** Desktop dual-column esports cockpit, tablet stacked view, and ergonomic mobile virtual touch D-pad.
- **Automated CI/CD Pipeline:** GitHub Actions workflow executing client builds, engine unit tests, verifier unit tests, and Supertest integration tests with live MongoDB services.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React, HTML5 Canvas 2D, Web Audio API |
| **Backend** | Node.js (ES Modules), Express 5, Mongoose 9, JWT (`jsonwebtoken`) |
| **Database** | MongoDB 6+ |
| **Security** | Helmet (CSP), HPP, express-rate-limit, express-slow-down, Zod |
| **Testing** | Vitest (Client & Server), Supertest |
| **CI/CD** | GitHub Actions (`ci.yml`) |

---

## 📚 Project Documentation

The project includes comprehensive documentation following the Complete Vibe Coding Architecture:

- [📄 Product Requirements Document (PRD)](docs/PRD.md) — Product scope, user personas, MVP definition, and success criteria.
- [🏗️ System Architecture](docs/ARCHITECTURE.md) — Full stack data flow, sequence diagrams, and directory breakdown.
- [🎨 Obsidian Arcade Design System](docs/DESIGN.md) — Color tokens, typography hierarchy, canvas drawing specs, and audio design.
- [📜 Development Rules](docs/RULES.md) — Coding standards, security rules, and architectural boundaries.
- [📋 Task Breakdown & Roadmap](docs/TASKS.md) — Phase-by-phase implementation status and future milestones.
- [🏛️ Architecture Decisions (ADRs)](docs/DECISIONS.md) — Records for key architectural choices (Anti-cheat, Canvas loop, Web Audio, Vitest).
- [🧠 Project Memory & Working State](docs/MEMORY.md) — Current sprint status, recent bug fixes, and active priorities.
- [🧪 Test Plan & QA Matrix](docs/TEST_PLAN.md) — Automated unit/integration test specifications and device testing matrix.
- [🔒 Security & Threat Model](docs/SECURITY.md) — Anti-cheat verification protocol, CSP configuration, and rate limiting details.

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/shanmukh00001/SNake_game_reack-backend.git
cd SNake_game_reack-backend
```

### 2. Configure Environment Variables
Create `.env` in `server/` and `client/` using the templates provided in `.env.example`:

**`server/.env`:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/snakeDB
JWT_SECRET=your_jwt_secret_token_min_32_characters
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5173
```

**`client/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

### 3. Install & Start Backend
```bash
cd server
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 4. Install & Start Frontend (In a separate terminal)
```bash
cd client
npm install
npm run dev
# Client starts on http://localhost:5173
```

---

## 🧪 Running Automated Tests

```bash
# Run client engine unit tests (17 tests)
cd client
npm test

# Run server unit & REST API integration tests (11 tests)
cd ../server
npm test
```

---

## 🔒 Anti-Cheat Replay Verification Protocol

```
Player Starts Game ──> POST /api/session/start ──> Signed JWT { seed, timestamp }
                                                          │
Game Over ────────────> POST /api/score ──────────────────┘
                        │
                        ▼
            GameVerificationService.verifyReplay()
            ├── 1. Unpacks seed & replay input log
            ├── 2. Simulates full 16x16 match with Mulberry32 PRNG
            ├── 3. Validates physics, speed progression & collisions
            └── 4. Rejects spoofed scores; commits verified high scores
```

---

## 📄 License
This project is licensed under the ISC License.
