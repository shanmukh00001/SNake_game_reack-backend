# Development Rules & Coding Standards — Snake Arcade

## 1. Core Principles & Philosophy
1. **Preserve Existing Tech Stack:** Use only React 19/Vite on the frontend and Node.js/Express 5 + MongoDB/Mongoose on the backend. Do not introduce unrequested alternative frameworks or heavy dependencies.
2. **Determinism First:** Any logic altering game state, snake coordinates, speed, or food positions MUST be 100% deterministic and synchronized across both client and server replay verifiers.
3. **Zero Direct Score Trust:** Never allow direct client updates to high scores without signed session token validation and deterministic replay verification.
4. **Clean Code & Modular Architecture:** Keep files under 300 lines where practical, decouple pure game math from React rendering, and isolate database queries in controllers/services.

---

## 2. Before Making Changes (AI & Developer Workflow)
- **Consult Documentation:** Review `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, and `docs/SECURITY.md` before altering core behavior.
- **Check Existing Implementations:** Always inspect existing functions, utility helpers in `lib/utils.js`, constants in `Constants.js`, and middleware in `server/src/middleware/` before authoring new abstractions.
- **Do Not Modify Unrelated Files:** Keep diffs focused strictly on the requested feature or fix.

---

## 3. Frontend Standards (React / Canvas / CSS)
- **Framework & Reactivity:** Use functional components with modern React hooks (`useState`, `useEffect`, `useCallback`, `useRef`, `useContext`).
- **Canvas Rendering Isolation:** Never trigger React re-renders on every game animation frame. Manage 60 FPS animation via `requestAnimationFrame` inside `CanvasRenderer.js` and update React state only on discrete events (score tick, pause, gameover).
- **Styling Tokens:** Use Tailwind utility classes conforming to `docs/DESIGN.md` color tokens (`bg-[#090A0C]`, `text-[#10B981]`, `border-[#232934]`).
- **Input Handling:** Route all keyboard and touch inputs through `InputBuffer.js` to prevent 180° self-destruction and preserve rapid multi-turn sequences.
- **Audio Feedback:** Synthesize sounds through `AudioEngine.js` using the Web Audio API; do not import large audio files.

---

## 4. Backend Standards (Node.js / Express / Mongoose)
- **ES Modules Standard:** All backend files must use native ES modules (`import`/`export`) with `.js` extensions. CommonJS `require()` is disallowed.
- **Schema Validation:** Validate all incoming HTTP request bodies and query parameters with Zod schemas. Return structured `400 Bad Request` messages for invalid payloads.
- **Error Handling:** Never let unhandled promise rejections crash Express. Wrap route handlers in `asyncHandler` or `try/catch` and forward errors to `errorMiddleware.js`.
- **Database Safety:** Always specify query timeouts (e.g. `.maxTimeMS(3000)`) and check connection readiness (`mongoose.connection.readyState === 1`) on public endpoints.

---

## 5. Security & Anti-Cheat Rules
- **Never Commit Secrets:** Do not hardcode JWT secrets, MongoDB URIs, or Google client secrets in code. Use `.env` variables and verify `.env.example` remains updated.
- **Strict Headers:** Maintain Helmet Content Security Policy (CSP), CORS origin whitelisting, and HPP parameter pollution protection.
- **Rate Limiting:** Protect all `/api` routes with `apiLimiter` and `apiSlowDown`, and apply dedicated `loginLimiter` and `scoreLimiter` on auth/submission endpoints.
- **Replay Validation Integrity:** The server verifier (`GameVerificationService.js`) must mirror client PRNG sequence, coordinate grid (16x16), initial speed (160ms), acceleration delta (3ms/food), and minimum step floor (65ms).

---

## 6. Testing & Verification Rules
- **Run Tests Before Committing:** Execute `npm test` in both `client/` and `server/` before opening a pull request or pushing to `main`.
- **Unit Test Coverage:** All mathematical functions, collision algorithms, PRNG generators, and verification logic must have corresponding Vitest unit tests in `src/engine/__tests__/` or `server/tests/unit/`.
- **Integration Test Coverage:** All REST endpoints must have Supertest integration tests verifying both valid and invalid/unauthorized requests in `server/tests/integration/`.
- **CI Pipeline:** The GitHub Actions workflow (`.github/workflows/ci.yml`) must pass with 0 failures on all branches.

---

## 7. Git & Commit Guidelines
- Use descriptive Conventional Commit messages:
  - `feat(engine): add progressive speed tier acceleration`
  - `fix(server): resolve leaderboard query timeout with maxTimeMS`
  - `test(verification): add unit tests for impossible replay duration`
  - `docs(prd): update anti-cheat requirements and tech stack specs`
- Keep commits small, atomic, and self-contained.
