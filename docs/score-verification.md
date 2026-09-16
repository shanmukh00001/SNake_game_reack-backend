# Deterministic Server-Side Score Verification

## 1. Overview & Threat Model

In competitive browser games, trusting raw client-submitted score numbers (`{ score: 2500 }`) creates an immediate vulnerability for trivially forged high scores via DevTools, network interception, or modified client scripts.

To prevent client spoofing while keeping server operational costs low, Snake Arcade implements **Deterministic Server-Side Score Verification** using headless simulation replay.

---

## 2. Verification Protocol

```
┌────────┐                                               ┌────────┐
│ Client │                                               │ Server │
└───┬────┘                                               └───┬────┘
    │                                                        │
    │ 1. POST /api/games/session/start (JWT Auth)            │
    ├───────────────────────────────────────────────────────>│
    │                                                        │ (Generates 32-bit random seed)
    │                                                        │ (Signs JWT: { userId, seed, startedAt })
    │ 2. Returns { sessionId, sessionToken, seed, config }   │ (Saves GameSession in MongoDB)
    │<───────────────────────────────────────────────────────┤
    │                                                        │
    │ [Client starts SeededRandom(seed)]                    │
    │ [Logs valid inputs: { tick, direction }]              │
    │ [Player dies or wins]                                 │
    │                                                        │
    │ 3. POST /api/games/session/submit                      │
    │    Payload: { sessionId, sessionToken, score,          │
    │              foodEaten, durationMs, inputLog }         │
    ├───────────────────────────────────────────────────────>│
    │                                                        │ 4. Verification Steps:
    │                                                        │    a. Verify JWT token validity & expiry
    │                                                        │    b. Validate session ownership (token vs req.user)
    │                                                        │    c. Check database session status (prevent replay)
    │                                                        │    d. Physical timing threshold check
    │                                                        │    e. Headless simulation replay from seed & inputs
    │                                                        │    f. Assert: simulatedScore === claimedScore
    │                                                        │
    │ 5. Returns { success: true, personalBest, isRecord }   │
    │<───────────────────────────────────────────────────────┤
```

---

## 3. Reconstructed Values vs. Client Claims

The server independently reconstructs the entire game trajectory tick-by-tick from the verified session seed:

| Metric | Client Claim | Server Independent Reconstruction |
|---|---|---|
| **Seed** | Ignored from payload | Extracted from cryptographic server-signed `sessionToken` |
| **Initial Coordinates** | Ignored | Reconstructed from fixed initial state `{ (5,8), (4,8), (3,8) }` |
| **Food Spawn Positions** | Ignored | Reconstructed tick-by-tick via deterministic `Mulberry32(seed)` |
| **Snake Trajectory** | Ignored | Reconstructed from validated `inputLog` map `{ tick => direction }` |
| **Collision Events** | Ignored | Checked on every simulated step (walls & self-body) |
| **Score & Food Count** | Claimed | Computed directly by simulation (10 pts per confirmed food hit) |
| **Physical Speed** | Claimed `durationMs` | Verified against minimum physical tick limit ($\ge 130\text{ms}$ per food) |

---

## 4. Rejection Criteria

Submissions are rejected (`400 Bad Request` or `409 Conflict`) if:
1. `sessionToken` is missing, expired, or tampered with.
2. `sessionToken.userId` does not match the authenticated user (`403 Forbidden`).
3. The session is already marked `completed` in MongoDB (Duplicate submission / replay attack prevention).
4. Physical duration is impossible (e.g. eating 10 foods in 200ms).
5. Headless simulation dies prematurely on a wall or body segment before reaching claimed food count.
6. The final reconstructed score does not match the claimed score.
7. The claimed score exceeds the theoretical board limit ($16 \times 16 \times 10 = 2560$).

---

## 5. Security Realities & Honest Trade-offs

Deterministic replay verification guarantees that **every submitted score corresponds to a genuine, mathematically valid game trajectory**. 

It prevents:
- Arbitrary score injection (e.g., editing JSON payloads).
- Teleportation or wall clipping hacks.
- Speed-spoofed submissions.

**Known Limitation**:
Like all client-side inputs in single-player games, deterministic verification does not prevent an external bot from running a pathfinding algorithm (e.g. BFS/A*) in real time to generate valid key inputs. It guarantees trajectory correctness, not player humanity.
