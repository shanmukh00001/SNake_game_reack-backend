import { User } from "../models/User.js";
import { GameSession } from "../models/GameSession.js";
import { Score } from "../models/Score.js";
import { PlayerStatistics } from "../models/PlayerStatistics.js";
import { GameVerificationService } from "../services/verificationService.js";
import jwt from "jsonwebtoken";
import { z } from "zod";

const ScoreSubmissionSchema = z.object({
  score: z.number().int().min(0).max(2560),
  foodEaten: z.number().int().min(0).optional().default(0),
  movesCount: z.number().int().min(0).optional().default(0),
  durationMs: z.number().int().min(0).optional().default(0),
  sessionId: z.string().optional(),
  sessionToken: z.string().optional(),
  inputLog: z
    .array(
      z.object({
        tick: z.number().int().min(0),
        direction: z.enum(["UP", "DOWN", "LEFT", "RIGHT"]),
        timestamp: z.number().optional(),
      })
    )
    .optional()
    .default([]),
});

/**
 * Start a game session issuing seed and cryptographic session token
 */
export const startGameSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const seed = Math.floor(Math.random() * 2147483647);
    const sessionToken = jwt.sign(
      {
        userId: req.user._id.toString(),
        seed,
        startedAt: Date.now(),
      },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "2h" }
    );

    const session = await GameSession.create({
      userId: req.user._id,
      sessionToken,
      seed,
      status: "active",
      startedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        sessionToken,
        seed,
        config: {
          gridSize: 16,
          initialTickMs: 160,
          minTickMs: 65,
          speedDeltaPerFood: 3,
        },
      },
      sessionToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to initialize game session",
      error: error.message,
    });
  }
};

/**
 * Save Score with Deterministic Server-Side Verification
 */
export const saveScore = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const parseResult = ScoreSubmissionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ success: false, message: parseResult.error.issues[0].message });
    }

    const {
      score,
      foodEaten,
      movesCount,
      durationMs,
      sessionId,
      sessionToken,
      inputLog,
    } = parseResult.data;

    let verified = false;

    // 1. Session verification & ownership checks
    if (sessionToken) {
      let decoded;
      try {
        decoded = jwt.verify(
          sessionToken,
          process.env.JWT_SECRET || "supersecretkey"
        );
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired game session token",
        });
      }

      // Check session token ownership
      if (decoded.userId && decoded.userId !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Session token does not belong to the authenticated user",
        });
      }

      // Check database session status if sessionId supplied
      if (sessionId) {
        const dbSession = await GameSession.findById(sessionId);
        if (!dbSession) {
          return res.status(404).json({
            success: false,
            message: "Game session not found in registry",
          });
        }

        if (dbSession.userId.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            message: "Game session does not belong to the authenticated user",
          });
        }

        if (dbSession.status === "completed") {
          return res.status(409).json({
            success: false,
            message: "Game session has already been completed and submitted",
          });
        }

        dbSession.status = "completed";
        dbSession.endedAt = new Date();
        await dbSession.save();
      }

      const verification = GameVerificationService.verifyReplay(
        decoded.seed,
        score,
        foodEaten,
        inputLog,
        durationMs
      );

      if (!verification.isValid) {
        return res.status(400).json({
          success: false,
          message: verification.error || "Score verification failed",
        });
      }

      verified = true;
    } else {
      // Direct submission without session
      if (score > 0 && inputLog.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Game session token is required to submit active run scores",
        });
      }
    }

    // 2. Persist score document
    await Score.create({
      userId: req.user._id,
      gameSessionId: sessionId || undefined,
      score,
      foodEaten,
      movesCount,
      durationMs,
      isVerified: verified,
    });

    // 3. Update User & PlayerStatistics
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let isNewHighScore = false;
    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
      isNewHighScore = true;
    }

    await PlayerStatistics.findOneAndUpdate(
      { userId: req.user._id },
      {
        $inc: {
          gamesPlayed: 1,
          totalFoodEaten: foodEaten || Math.floor(score / 10),
          totalPlaytimeMs: durationMs,
        },
        $max: { highestScore: score },
      },
      { upsert: true }
    );

    return res.json({
      success: true,
      message: isNewHighScore ? "New high score recorded!" : "Score recorded",
      highScore: user.highScore,
      isNewHighScore,
      data: {
        score,
        personalBest: user.highScore,
        isNewPersonalBest: isNewHighScore,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Top Leaderboard Rankings
 */
export const getLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const users = await User.find({ highScore: { $gt: 0 } })
      .sort({ highScore: -1, updatedAt: 1 })
      .limit(limit)
      .lean();

    const leaderboard = users.map((u, index) => {
      const displayName =
        u.name || (u.email ? u.email.split("@")[0] : "Player");
      return {
        rank: index + 1,
        name: displayName,
        picture: u.picture || null,
        highScore: u.highScore || 0,
      };
    });

    return res.json(leaderboard);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
};
