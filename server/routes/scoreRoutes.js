import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveScore, getLeaderboard } from "../controllers/scoreController.js";

const router = express.Router();

router.post("/score", protect, saveScore);
router.get("/leaderboard", getLeaderboard);

export default router;