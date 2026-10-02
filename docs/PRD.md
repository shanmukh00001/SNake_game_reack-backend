# Product Requirements Document (PRD) — Snake Arcade

## 1. Product Overview
**Product Name:** Snake Arcade (Deterministic Full-Stack Web Edition)  
**Version:** 1.0.0  
**Status:** In Production / Active Development  
**Repository:** `shanmukh00001/SNake_game_reack-backend`

---

## 2. Problem Statement
Traditional browser-based Snake games suffer from several recurring problems:
1. **Unfair Leaderboards & Score Spoofing:** Naive client-side score submissions can be intercepted, forged, or manipulated using simple HTTP requests or browser devtools console scripts.
2. **Laggy, Inconsistent Input Handling:** Rapid double-keypresses (e.g., turning Up then Left quickly) often result in accidental 180° self-collisions or dropped inputs due to unbuffered event listeners.
3. **Cluttered, Inconsistent Visuals:** Many clones lack a coherent aesthetic, missing modern tactile esports arcade styling, responsive mobile virtual controls, and procedural audio.
4. **Friction in Authentication:** Players want instant guest play without forced signups, while competitive players need seamless Google OAuth to secure their high score rankings.

---

## 3. Target Users & Personas
- **Arcade Enthusiasts & Casual Gamers:** Players looking for quick, responsive, nostalgic arcade sessions on mobile or desktop.
- **Competitive Leaderboard Climbers:** Gamers who want tamper-proof, verified high scores and persistent rankings with verified badges.
- **Developers & Reviewers:** Technical evaluators assessing clean full-stack architecture, deterministic simulation, and anti-cheat verification.

---

## 4. Goals & Value Proposition
- **Esports-Grade Determinism:** The client and server run identical Mulberry32 PRNG and grid physics to cryptographically verify every food spawn, movement tick, and collision.
- **Zero Input Dropping:** A specialized 2-depth FIFO `InputBuffer` prevents reverse 180° suicide while buffering rapid multi-turn sequences.
- **Seamless Dual-Mode Access:** Instant guest mode for casual play + Google OAuth 2.0 with JWT sessions for authenticated leaderboard competition.
- **Tactile "Obsidian Arcade" Aesthetic:** Deep void tones (`#090A0C`), vibrant phosphor emeralds (`#10B981`), terracotta food nodes (`#C45643`), procedural Web Audio FX, and responsive cockpit telemetry.

---

## 5. Core Features (In-Scope)

### A. Game Engine & Simulation
- **16x16 Discrete Grid Matrix:** Deterministic coordinate system with fixed 1:1 canvas aspect ratio.
- **Dynamic Speed Progression:** Initial 160ms tick decreasing progressively down to 65ms floor based on food consumed.
- **Collision Detection:** Wall boundaries and self-intersection with intelligent tail-vacation awareness.
- **Deterministic Food Spawning:** Seeded random generator guaranteeing reproducible fruit coordinates given an initial integer seed.
- **Procedural Audio Synthesis:** Web Audio API generating tone bursts for eating, speed tier bumps, and game over without external asset network latency.

### B. Anti-Cheat & Cryptographic Verification
- **Session Handshake (`/api/session/start`):** Server generates a cryptographically signed JWT containing an integer `seed` and issuance timestamp.
- **Input Telemetry Logging:** Client records tick-indexed direction turns `[{ tick, direction, timestamp }]`.
- **Server-Side Replay Simulation (`/api/score` / `/api/games/session/submit`):** Server recreates the entire match from the seed and input log, verifying final score, food count, physical duration, and collision validity before committing to the database.

### C. Authentication & Player Profiles
- **Google OAuth 2.0:** Secure GIS token exchange verifying identity via `google-auth-library` and issuing signed JWTs.
- **Guest Player Support:** Playable out of the box with local high score storage; prompts login on high score achievement to save globally.
- **Player Statistics:** Tracks career games played, total food eaten, aggregate playtime, and peak score.

### D. Global Leaderboard
- **Top 10 / Top 50 Rankings:** Real-time query sorted by verified high score with player avatars, names, and rank badges.
- **Rate-Limited & Cached:** High throughput protection via Express rate limiters and MongoDB indexed queries.

---

## 6. MVP Scope vs Future Scope

| Feature Area | MVP (Phase 1-6) | Post-MVP (Future Roadmap) |
|---|---|---|
| **Gameplay** | Single-player deterministic classic snake | Real-time 1v1 PvP split-screen or WebSocket battle royale |
| **Auth** | Google OAuth + Guest Mode | GitHub / Discord OAuth, Email/Password magic links |
| **Leaderboard** | Global All-Time High Scores | Daily/Weekly resets, Country/Regional leaderboards |
| **Audio** | Procedural Web Audio API sound FX | Retro chiptune background music tracks & sound packs |
| **Cosmetics** | Classic Emerald & Obsidian theme | Unlockable skins (Neon Cyan, Synthwave, Cyber Gold) |
| **Platforms** | Responsive Web (Desktop, Tablet, Mobile Touch) | Native PWA offline install, Electron desktop wrapper |

---

## 7. Out of Scope (What We Are NOT Building)
- Real-time multiplayer server-authoritative netcode (WebSockets/WebRTC).
- Pay-to-win mechanics, microtransactions, or cryptocurrency tokens.
- Bloated third-party analytics trackers that degrade canvas frame rates.
- Unsanitized direct client score writes without cryptographic replay checks.

---

## 8. Success Criteria & KPIs
1. **Framerate & Performance:** Consistent 60fps rendering in HTML5 Canvas on both mobile and desktop browsers with < 5% CPU usage.
2. **Input Responsiveness:** Sub-50ms turn registration with 0% dropped rapid sequence turns and 0% accidental 180° self-kills.
3. **Anti-Cheat Reliability:** 100% rejection rate for modified scores, teleported positions, impossible durations, or spoofed payloads.
4. **Test Suite Coverage:** 100% pass rate across engine unit tests, verification service unit tests, and REST API integration tests.
5. **Security & Stability:** Zero unhandled Express errors, strict Helmet CSP, CORS compliance, and automated GitHub Actions CI validation on every push.
