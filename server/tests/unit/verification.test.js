import { describe, it, expect } from "vitest";
import { GameVerificationService } from "../../src/services/verificationService.js";

describe("GameVerificationService - Deterministic Server-Side Score Verification", () => {
  const testSeed = 12345;

  it("A. verifies legitimate replay where claimed score matches simulated ticks", () => {
    const inputLog = [{ tick: 0, direction: "RIGHT" }];
    const result = GameVerificationService.verifyReplay(
      testSeed,
      0, // claimedScore
      0, // claimedFoodEaten
      inputLog,
      5000 // durationMs
    );
    expect(result.isValid).toBe(true);
    expect(result.expectedScore).toBe(0);
    expect(result.expectedFoodCount).toBe(0);
  });

  it("B. rejects modified/spoofed score that deviates from simulation", () => {
    const inputLog = [{ tick: 0, direction: "RIGHT" }];
    const result = GameVerificationService.verifyReplay(
      testSeed,
      100, // claimedScore spoofed to 100
      10,
      inputLog,
      10000
    );
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("mismatch");
  });

  it("C. rejects modified food count when mismatched with calculated food count", () => {
    const inputLog = [{ tick: 0, direction: "RIGHT" }];
    const result = GameVerificationService.verifyReplay(
      testSeed,
      50, // claimed 50 points
      0,
      inputLog,
      10000
    );
    expect(result.isValid).toBe(false);
  });

  it("E. rejects physically impossible completion speed / duration", () => {
    const result = GameVerificationService.verifyReplay(
      testSeed,
      100, // 10 foods
      10,
      [],
      200 // 200ms for 10 foods is physically impossible
    );
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("Impossible completion speed");
  });

  it("F. detects modified/invalid inputs leading to wall collisions during replay", () => {
    // Starting at x=5, moving right 15 ticks will hit right wall (x >= 16)
    const inputLog = [{ tick: 0, direction: "RIGHT" }];
    const result = GameVerificationService.verifyReplay(
      testSeed,
      50, // claims 50 points but simulation died on tick 11
      5,
      inputLog,
      5000
    );
    expect(result.isValid).toBe(false);
    expect(result.expectedScore).toBe(0);
  });

  it("J. rejects scores exceeding maximum grid capacity threshold", () => {
    const result = GameVerificationService.verifyReplay(
      testSeed,
      3000, // Max 16x16 grid capacity is 2560
      300,
      [],
      50000
    );
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("threshold");
  });
});
