# Architecture Decision Records (ADRs) — Snake Arcade

## ADR-001: Decoupled Monorepo Architecture (React/Vite + Express/Node)
- **Status:** Accepted
- **Context:** The application requires a blazing fast 60fps frontend client and an anti-cheat validation backend API that can scale and deploy independently.
- **Decision:** Split the repository into two primary directories: `client/` (React + Vite + Tailwind) and `server/` (Node.js ES Modules + Express 5 + MongoDB).
- **Rationale:** Clear separation of concerns, independent testing lifecycles, and simplified cloud deployment (e.g. Vercel for client SPA, Render/Railway/Fly.io for server).
- **Consequences:** Requires running two dev processes locally (handled seamlessly via npm scripts).

---

## ADR-002: Deterministic Server-Side Replay Verification for Anti-Cheat
- **Status:** Accepted
- **Context:** Naive leaderboard web games trust scores sent directly in HTTP POST requests (`{ score: 9999 }`), leading to rampant cheating and ruined competition.
- **Decision:** Implement a cryptographic seed-handshake (`POST /api/session/start`) and deterministic tick replay simulation (`GameVerificationService.verifyReplay()`). The client logs turns `[{ tick, direction }]` and the server simulates the entire match before accepting high scores.
- **Rationale:** Provides 100% mathematical tamper-proofing against score spoofing without requiring expensive server-authoritative WebSocket loops during active play.
- **Consequences:** Score submissions require a brief replay verification step (< 10ms CPU time) on the server.

---

## ADR-003: HTML5 Canvas 2D Rendering with Decoupled Game Loop
- **Status:** Accepted
- **Context:** Rendering snake segments and fruit using React DOM components (`<div>`) causes layout thrashing, component re-renders, and frame drops during high-speed gameplay.
- **Decision:** Use an HTML5 `<canvas>` element driven by `requestAnimationFrame` inside a dedicated `CanvasRenderer.js` class, updating React state only on key game events (game over, pause, score milestones).
- **Rationale:** Guarantees rock-solid 60 FPS performance, precise sub-pixel grid styling, and zero DOM overhead.
- **Consequences:** Visual customization requires Canvas 2D drawing calls rather than standard CSS classes.

---

## ADR-004: Procedural Web Audio API Sound Generation
- **Status:** Accepted
- **Context:** External audio files (`.mp3`, `.wav`) introduce network latency, asset loading failures, and awkward audio unlock delays on mobile devices.
- **Decision:** Generate all game sound effects (food blips, speedup chimes, crash noises) procedurally in `AudioEngine.js` using browser Web Audio API oscillator nodes (`sine`, `sawtooth`, `square`) and gain envelopes.
- **Rationale:** Instant zero-latency sound synthesis, zero network bandwidth overhead, and precise microsecond timing.
- **Consequences:** Sound effects are synthesized in retro arcade wave tones rather than recorded orchestral samples.

---

## ADR-005: 2-Depth FIFO Input Buffer with Anti-180° Turn Protection
- **Status:** Accepted
- **Context:** In classic Snake, pressing two directional keys rapidly within a single tick (e.g. moving Right, then pressing Up then Left) often causes an immediate 180° reverse turn into the snake's own neck, instantly killing the player.
- **Decision:** Implement a 2-depth FIFO queue (`InputBuffer.js`) that validates turns against the queued direction rather than only the active moving direction, discarding opposite turns while queuing valid turns in sequence.
- **Rationale:** Eliminates accidental suicide and allows competitive players to queue rapid corner turns with precision.
- **Consequences:** Maximum turn queue depth is capped at 2 to prevent excessive latency between player input and execution.

---

## ADR-006: Google OAuth 2.0 with JWT Sessions + Guest Mode Fallback
- **Status:** Accepted
- **Context:** Players want to play immediately without mandatory registration friction, but leaderboard competition requires verified unique player identities.
- **Decision:** Support dual access: instant Guest Mode with local high score storage + Google OAuth 2.0 (Google Identity Services) for cloud high score synchronization and global leaderboard entry.
- **Rationale:** Lowers onboarding friction while guaranteeing authentic identities and avatars for top leaderboard ranks.
- **Consequences:** Backend maintains Google OAuth credential verification using `google-auth-library`.

---

## ADR-007: Vitest for Unified Client and Server Testing
- **Status:** Accepted
- **Context:** Need a unified, high-speed test runner that natively supports ES Modules and TypeScript without complex Babel/Jest transform configurations.
- **Decision:** Standardize on Vitest across both `client/` and `server/` packages.
- **Rationale:** Sub-second test execution, native ESM support, compatible with Vite toolchain, and unified testing syntax (`describe`, `it`, `expect`).
- **Consequences:** Fast local test cycles and seamless CI execution in GitHub Actions.
