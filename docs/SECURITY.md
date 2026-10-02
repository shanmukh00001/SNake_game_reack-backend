# Security & Anti-Cheat Specifications — Snake Arcade

## 1. Security Philosophy & Threat Model
As a competitive arcade web game, Snake Arcade is subject to both standard web vulnerabilities (injection, XSS, CSRF, DDoS) and game-specific attack vectors (score manipulation, memory tampering, replay replay-attacks).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THREAT VECTORS & DEFENSES                       │
├────────────────────────────────┬───────────────────────────────────────┤
│ Threat Vector                  │ Implemented Mitigation                │
├────────────────────────────────┼───────────────────────────────────────┤
│ 1. Fake Score Injection        │ Deterministic Seed Replay Simulation  │
│ 2. Replay Token Re-use Attack  │ One-time GameSession State Machine    │
│ 3. Automated Script Flooding   │ express-rate-limit + express-slow-down│
│ 4. Cross-Site Scripting (XSS)  │ Helmet CSP & React JSX Auto-escaping  │
│ 5. Parameter Pollution / NoSQL │ HPP + Mongoose Typed Schemas          │
│ 6. Token Forgery               │ Signed JWT with Expiration & Auth Clms│
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 2. Anti-Cheat & Deterministic Replay Protocol

### A. The Challenge
In client-rendered games, players can open browser developer tools and modify local variables (`score = 99999`) or make forged POST requests to the score API.

### B. The Mitigation
1. **Cryptographic Seed Handshake:**
   - When a match starts, `POST /api/session/start` generates an integer seed using a cryptographic RNG and returns a signed JWT `sessionToken` containing `{ userId, seed, startedAt }`.
   - A corresponding `GameSession` document is saved in MongoDB with status `"active"`.
2. **Tick-by-Tick Input Telemetry:**
   - The client records every turn input as an immutable log: `[{ tick: 0, direction: "RIGHT" }, { tick: 14, direction: "UP" }]`.
3. **Server-Side Deterministic Replay:**
   - When submitting score (`POST /api/score`), the server unpacks the `sessionToken` to extract the original seed.
   - `GameVerificationService.js` simulates the full 16x16 game step-by-step from tick 0 to completion using the exact same Mulberry32 PRNG.
   - If the simulated score, food eaten, or collision tick does not match the claimed values, the submission is rejected with `400 Bad Request`.
4. **One-Time Session Consumption:**
   - Once verified, the `GameSession` document is permanently marked as `"completed"`. Any subsequent attempts to submit the same session token result in `409 Conflict`.

---

## 3. Authentication & Session Security

- **Google Identity Services (GIS):**
  - Google ID tokens are verified server-side using Google's official `OAuth2Client` (`google-auth-library`).
  - Google audience (`GOOGLE_CLIENT_ID`) is strictly checked before provisioning or fetching user accounts.
- **JWT Authorization:**
  - Authenticated API requests require an `Authorization: Bearer <token>` header.
  - JWTs are signed with `process.env.JWT_SECRET` using HMAC SHA-256 and configured with 30-day user session expiration and 2-hour match session expiration.
  - Ownership is verified across all session operations (`req.user._id === dbSession.userId`).

---

## 4. Network & Middleware Defense-in-Depth

### Rate Limiting & Speed Bumps
- **Global API Limiter:** Limits general IP requests to 200/hour in production (10,000 in dev/test).
- **Score Submission Limiter:** Strictly limits score posts to 10 submissions per minute per IP/user to prevent bot flooding.
- **Login Limiter:** Limits login exchanges to 15 attempts per 15 minutes per IP.
- **Bot SlowDown:** Delays suspicious high-frequency requests by 500ms progressive steps.

### Content Security Policy & Security Headers (Helmet)
```javascript
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://accounts.google.com"],
      connectSrc: [
        "'self'",
        "http://localhost:5000",
        "https://accounts.google.com",
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
      ],
      frameSrc: ["'self'", "https://accounts.google.com"],
      imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"],
    },
  })
);
```

### Input Validation & Sanitization
- **Payload Validation:** All incoming request bodies are strictly validated against strongly-typed Zod schemas (`ScoreSubmissionSchema`).
- **Parameter Pollution (HPP):** `hpp()` middleware prevents query string pollution attacks.
- **Query Timeouts:** Leaderboard queries enforce `.maxTimeMS(3000)` timeouts to prevent database exhaustion.

---

## 5. Secrets Management & Environment Isolation
- No private keys, database credentials, or API secrets are stored in version control.
- All secrets are loaded via environment variables (`process.env`) using `dotenv`.
- Production and development environments utilize isolated database instances.
