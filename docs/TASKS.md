# Development Tasks & Roadmap — Snake Arcade

## Phase 1: Project Setup & Core Infrastructure
- [x] **TASK-101:** Initialize monorepo structure with decoupled `client/` and `server/` directories.
- [x] **TASK-102:** Configure Vite + React 19 build pipeline and Tailwind CSS setup in `client/`.
- [x] **TASK-103:** Configure Node.js (ESM), Express 5, and Mongoose connection in `server/`.
- [x] **TASK-104:** Create environment variable templates (`.env.example`) for both client and server.
- [x] **TASK-105:** Configure Git repository, `.gitignore`, and branch protection rules.

---

## Phase 2: Deterministic Game Engine & Audio
- [x] **TASK-201:** Implement 16x16 discrete coordinate grid matrix in `SnakeEngine.js`.
- [x] **TASK-202:** Implement Seeded Mulberry32 PRNG in `Random.js` for deterministic food placement.
- [x] **TASK-203:** Implement 2-slot FIFO `InputBuffer.js` with 180° reverse-turn suicide prevention.
- [x] **TASK-204:** Build `CollisionSystem.js` for boundary checking and dynamic tail vacation collision rules.
- [x] **TASK-205:** Implement `DifficultySystem.js` with progressive step acceleration (160ms down to 65ms).
- [x] **TASK-206:** Build high-performance `CanvasRenderer.js` with pixel-perfect grid and bevel shading.
- [x] **TASK-207:** Build Web Audio API procedural synthesizer in `AudioEngine.js` for sound FX.
- [x] **TASK-208:** Author comprehensive Vitest test suite (`engine.test.js`) verifying physics and turn queues.

---

## Phase 3: Authentication & Player Profiles
- [x] **TASK-301:** Integrate Google Identity Services (GIS) login button and credential exchange in `LoginPage.jsx`.
- [x] **TASK-302:** Create `AuthContext.jsx` with persistent token storage and guest mode fallback.
- [x] **TASK-303:** Implement `authController.js` validating Google tokens via `google-auth-library` and issuing JWTs.
- [x] **TASK-304:** Build `User` and `PlayerStatistics` Mongoose models with aggregate gameplay counters.
- [x] **TASK-305:** Implement `/api/auth/me` and JWT protection middleware in `authMiddleware.js`.

---

## Phase 4: Anti-Cheat & Deterministic Replay Verification
- [x] **TASK-401:** Implement cryptographic session start endpoint (`POST /api/session/start`) issuing signed seed JWTs.
- [x] **TASK-402:** Create `GameSession` model tracking active vs completed session tokens to prevent replay replay-attacks.
- [x] **TASK-403:** Build `GameVerificationService.js` simulating complete match replays tick-by-tick on the server.
- [x] **TASK-404:** Add impossible duration and max grid capacity anomaly detection algorithms to the verifier.
- [x] **TASK-405:** Implement secure score submission endpoint (`POST /api/score`) verifying replays before high-score writes.
- [x] **TASK-406:** Author unit tests in `verification.test.js` validating valid replays and rejecting spoofed runs.

---

## Phase 5: UI/UX & Obsidian Arcade Design System
- [x] **TASK-501:** Implement Obsidian Arcade design system tokens (Void `#090A0C`, Laser Emerald `#10B981`, Terracotta `#C45643`).
- [x] **TASK-502:** Build responsive `GameHUD.jsx` with real-time score, personal best, and speed tier readouts.
- [x] **TASK-503:** Implement `LeaderboardCard.jsx` displaying global top players with rank badges and profile avatars.
- [x] **TASK-504:** Build tactile `GameOverModal.jsx` and `GamePauseModal.jsx` with restart/resume shortcuts.
- [x] **TASK-505:** Create ergonomic mobile virtual touch D-pad for mobile and tablet touchscreens.
- [x] **TASK-506:** Add sound volume controls and theme settings in `SettingsPanel.jsx`.

---

## Phase 6: Testing & Quality Assurance
- [x] **TASK-601:** Configure Vitest runner across client and server packages.
- [x] **TASK-602:** Write REST API endpoint integration tests in `api.test.js` using Supertest.
- [x] **TASK-603:** Fix database query timeout and buffer handling in test suite (`maxTimeMS`, `bufferCommands: false`).
- [x] **TASK-604:** Validate cross-browser responsive layout on Desktop (1440px), Tablet (768px), and Mobile (375px).

---

## Phase 7: Deployment & CI/CD Pipeline
- [x] **TASK-701:** Author GitHub Actions workflow (`.github/workflows/ci.yml`) for automated client and server verification.
- [x] **TASK-702:** Configure containerized MongoDB 6.0 service with automated healthchecks in CI pipeline.
- [x] **TASK-703:** Configure client production build optimizations (`npm run build` via Vite).
- [x] **TASK-704:** Configure silent `/favicon.ico` handler to prevent 404 log spam.
- [x] **TASK-705:** Configure production Vercel configuration (`vercel.json`) for frontend SPA routing.

---

## Phase 8: Future Roadmap & Post-Launch
- [ ] **TASK-801:** Implement daily and weekly leaderboard resets with archival badge history.
- [ ] **TASK-802:** Add optional PWA manifest for offline installation on Android/iOS devices.
- [ ] **TASK-803:** Introduce unlockable visual arcade themes (Cyberpunk Cyan, Synthwave Purple, Monochrome CRT).
- [ ] **TASK-804:** Implement global replay playback viewer allowing players to watch top leaderboard runs.
- [ ] **TASK-805:** Add Discord and GitHub OAuth login providers.
