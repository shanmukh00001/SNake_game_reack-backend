import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  saveScore,
  getLeaderboard,
  startGameSession,
} from "../controllers/scoreController.js";
import { scoreLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Supported RESTful route endpoints & aliases
router.post("/session/start", protect, startGameSession);
router.post("/games/session/start", protect, startGameSession);

router.post("/score", protect, scoreLimiter, saveScore);
router.post("/games/session/submit", protect, scoreLimiter, saveScore);

router.get("/leaderboard", getLeaderboard);

export default router;
