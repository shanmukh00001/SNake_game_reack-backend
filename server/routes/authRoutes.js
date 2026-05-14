import express from "express";
import { googleAuth, updateName, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/google", googleAuth);
router.get("/me", protect, getMe);
router.put("/update-name", protect, updateName);

export default router;