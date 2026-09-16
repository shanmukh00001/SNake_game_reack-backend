import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// 1. Account Creation / Login Limiter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 15,
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Score Submission Limiter (10 per minute per user/IP)
export const scoreLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 10,
  message: {
    success: false,
    message: "Please wait a moment before saving another score",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Global API Limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
      ? 10000
      : 200,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. Speed Bump for Bot Throttling
export const apiSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: process.env.NODE_ENV === "test" ? 10000 : 60,
  delayMs: () => 500,
});
