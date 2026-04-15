import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveScore, getLeaderboard } from "../controllers/scoreController.js";

import { scoreLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/score", protect, scoreLimiter, saveScore);
router.get("/leaderboard", getLeaderboard);

export default router;