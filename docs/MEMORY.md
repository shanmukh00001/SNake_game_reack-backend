# Project Memory & Working State — Snake Arcade

## 1. Current Status
- **Overall Project State:** Stable & Production Ready
- **CI Pipeline:** Passing (17 client tests pass, 11 server tests pass)
- **Recent Fixes Applied:**
  - Resolved `GET /api/leaderboard` timeout issue in `api.test.js` by disabling command buffering on disconnected test states (`mongoose.set("bufferCommands", false)`), increasing test timeout to 15s, adding `.maxTimeMS(3000)` query timeouts, and introducing MongoDB healthchecks in `.github/workflows/ci.yml`.
  - Added silent `/favicon.ico` handler to prevent 404 error log pollution.
  - Upgraded GitHub Actions runners to Node.js 22 to prevent Node 20 deprecation notices.

---

## 2. Completed Milestones
1. **Frontend Architecture (`client/`):**
   - Canvas 2D 60fps render loop with high-DPI scaling and crisp sub-pixel grid styling.
   - Seeded Mulberry32 PRNG and deterministic collision system.
   - 2-depth FIFO turn queue preventing 180° self-destruction.
   - Web Audio API procedural sound synthesizer (food blip, speedup, collision).
   - Full "Obsidian Arcade" UI with responsive cockpit layout, HUD telemetry, and mobile virtual touch D-pad.
   - Google OAuth 2.0 and guest mode state management in `AuthContext.jsx`.
2. **Backend Architecture (`server/`):**
   - Node.js ESM Express 5 REST API.
   - Cryptographic session token issuance with integer seed handshakes.
   - `GameVerificationService.js` simulating complete match replays tick-by-tick.
   - MongoDB integration with Mongoose models (`User`, `Score`, `GameSession`, `PlayerStatistics`).
   - Comprehensive security suite: Helmet CSP, HPP, express-rate-limit, express-slow-down, JWT.
3. **Automated Verification:**
   - 17 frontend engine unit tests passing.
   - 6 backend anti-cheat unit tests passing.
   - 5 backend integration API tests passing.
   - GitHub Actions CI workflow operational.

---

## 3. Active Task & Priorities
- **Current Task:** Comprehensive project documentation architecture setup conforming to the Complete Vibe Coding Guide.
- **Priority:** Ensure all docs (`PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `RULES.md`, `TASKS.md`, `DECISIONS.md`, `MEMORY.md`, `TEST_PLAN.md`, `SECURITY.md`, `.cursor/rules/`, `README.md`, `.env.example`) reflect the existing tech stack precisely.

---

## 4. Known Issues & Mitigations

| Issue / Challenge | Impact | Mitigation / Solution | Status |
|---|---|---|---|
| **MongoDB CI Initialization Delay** | Integration tests timed out waiting for database ready state. | Added `--health-cmd` to GitHub Actions MongoDB service and added `maxTimeMS` + `bufferCommands: false` to tests. | **Resolved** |
| **Node 20 GitHub Actions Deprecation** | Warning annotations on CI runs. | Bumped Node version target to 22 in `ci.yml`. | **Resolved** |
| **Accidental 180° Keypress Collision** | Frustrating sudden death on rapid dual turns. | Built 2-depth FIFO `InputBuffer` checking turns against queued direction. | **Resolved** |
| **Score Spoofing via Postman/DevTools** | Leaderboard integrity compromised. | Built deterministic server-side replay verifier requiring valid session seed and input log. | **Resolved** |

---

## 5. Next Steps
1. Push documentation architecture and CI workflow enhancements to GitHub.
2. Maintain `TASKS.md` and `MEMORY.md` as new features (e.g. daily resets, unlockable themes) are implemented.
