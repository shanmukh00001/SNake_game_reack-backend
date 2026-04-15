import express from "express";
import { googleAuth, updateName } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/google", googleAuth);
router.put("/update-name", protect, updateName);

export default router;