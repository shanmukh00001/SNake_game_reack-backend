import express from "express";
import {
  googleAuth,
  updateName,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/google", loginLimiter, googleAuth);
router.get("/me", protect, getMe);
router.put("/update-name", protect, updateName);

export default router;
