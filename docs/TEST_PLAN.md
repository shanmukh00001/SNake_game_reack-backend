# Quality Assurance & Test Plan — Snake Arcade

## 1. Testing Philosophy & Strategy
The Snake Arcade test strategy combines **automated deterministic unit testing**, **REST API integration testing**, **anti-cheat security fuzzing**, and **responsive cross-device UI validation**.

```
                   ┌───────────────────────────────────┐
                   │    End-to-End & Device Testing    │
                   │ (Desktop, Tablet, Mobile Touch)   │
                   └─────────────────┬─────────────────┘
                                     │
                   ┌─────────────────┴─────────────────┐
                   │   REST API Integration Testing    │
                   │ (Supertest / Authentication / DB) │
                   └─────────────────┬─────────────────┘
                                     │
     ┌───────────────────────────────┴───────────────────────────────┐
     │                                                               │
┌────┴──────────────────────────┐       ┌────────────────────────────┴──┐
│  Client Engine Unit Tests     │       │ Server Replay Verification    │
│ (InputBuffer, Physics, PRNG)  │       │ (Anti-Cheat Fuzzing & Attacks)│
└───────────────────────────────┘       └───────────────────────────────┘
```

---

## 2. Automated Test Matrix

### A. Client Engine Unit Tests (`client/src/engine/__tests__/engine.test.js`)
| Test Case ID | Component | Description | Expected Outcome |
|---|---|---|---|
| **UT-CL-01** | `InputBuffer` | Accepts valid orthogonal 90° turns | Direction queued and dequeued in FIFO order |
| **UT-CL-02** | `InputBuffer` | Rejects direct 180° opposite keypress | Input discarded, snake continues safely |
| **UT-CL-03** | `InputBuffer` | Handles rapid dual-keypress sequence (Right -> Up -> Left) | Both turns execute sequentially across successive ticks |
| **UT-CL-04** | `InputBuffer` | Rejects rapid double-key 180° reversal (Up then Down) | Down discarded while Up remains queued |
| **UT-CL-05** | `InputBuffer` | Enforces max queue depth limit (2) | 3rd rapid input discarded |
| **UT-CL-06** | `CollisionSystem`| Wall collision at borders (x<0, x≥16, y<0, y≥16) | Returns `true` on boundary breach |
| **UT-CL-07** | `CollisionSystem`| Self collision with snake body | Returns `true` when head hits body, `false` for vacated tail |
| **UT-CL-08** | `CollisionSystem`| Food placement on occupied tiles | Never spawns food on tiles occupied by snake segments |
| **UT-CL-09** | `SeededRandom` | Deterministic pseudo-randomness | Identical seeds produce 100% identical number sequences |
| **UT-CL-10** | `SeededRandom` | Seed variance | Different seeds produce distinct, uncorrelated sequences |
| **UT-CL-11** | `SnakeEngine` | Default initialization state | Score 0, length 3, direction RIGHT, status READY |
| **UT-CL-12** | `SnakeEngine` | Simulation tick advance | Snake moves 1 cell in active direction |
| **UT-CL-13** | `SnakeEngine` | Wall collision trigger | Game status transitions to `GAMEOVER` |
| **UT-CL-14** | `SnakeEngine` | Food consumption & growth | Score increases by 10, snake length increases by 1 |
| **UT-CL-15** | `SnakeEngine` | Pause / Resume transitions | State toggles between `RUNNING` and `PAUSED` |
| **UT-CL-16** | `SnakeEngine` | Input telemetry logging | Records tick number and direction for server replay |
| **UT-CL-17** | `DifficultySystem`| Progressive speed calculation | Speeds up per food eaten, bounded by 65ms floor |

### B. Anti-Cheat Verification Unit Tests (`server/tests/unit/verification.test.js`)
| Test Case ID | Description | Attack Vector / Scenario | Expected Outcome |
|---|---|---|---|
| **UT-SV-01** | Legitimate Match Replay | Authentic player run with matching food ticks | Verification succeeds (`isValid: true`) |
| **UT-SV-02** | Score Spoofing Attack | Submitting claimed score 100 on run that earned 0 | Replay rejects (`isValid: false`, score mismatch) |
| **UT-SV-03** | Food Count Mismatch | Submitting 50 points with claimed food count 0 | Replay rejects (`isValid: false`) |
| **UT-SV-04** | Impossible Duration Attack | Submitting 10 food items consumed in 200ms | Replay rejects (impossible speed anomaly detected) |
| **UT-SV-05** | Phantom Input Wall Collision | Submitting input log that collides with wall on tick 11 | Replay rejects (premature game over during simulation) |
| **UT-SV-06** | Capacity Overflow Attack | Submitting score > 2560 on 16x16 grid | Replay rejects (exceeds theoretical max capacity) |

### C. REST API Integration Tests (`server/tests/integration/api.test.js`)
| Test Case ID | Endpoint | Method | Payload / Headers | Expected Status |
|---|---|---|---|---|
| **IT-API-01** | `/` | GET | None | `200 OK` + Health message |
| **IT-API-02** | `/api/leaderboard` | GET | None / `?limit=10` | `200 OK` + Array of rank items |
| **IT-API-03** | `/api/auth/google` | POST | `{}` (missing token) | `400 Bad Request` |
| **IT-API-04** | `/api/session/start` | POST | No Bearer Auth Header | `401 Unauthorized` |
| **IT-API-05** | `/api/score` | POST | No Bearer Auth Header | `401 Unauthorized` |

---

## 3. Manual QA & Device Testing Matrix

| Viewport / Device | Breakpoint | Focus Areas | Criteria |
|---|---|---|---|
| **Desktop High-Res** | 1440px+ | Cockpit layout, Keyboard controls (`WASD`, Arrow keys, `Space` for pause) | Crisp 60fps canvas, zero layout shift, instant pause |
| **Laptop / Standard** | 1024px - 1366px | Telemetry dock alignment, Leaderboard card | High contrast HUD readouts, no scrolling required |
| **Tablet** | 768px - 1023px | Stacked HUD, Touch responsiveness | Canvas centers properly, HUD stays legible |
| **Mobile Large / Small**| 375px - 430px | Single column, Virtual Touch D-pad | Ergonomic thumb reach, zero accidental page scrolling |

---

## 4. Test Execution Commands

```bash
# Run all client unit tests
cd client
npm test

# Run all server unit & integration tests
cd ../server
npm test
```
