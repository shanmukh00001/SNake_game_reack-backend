import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// 1. Account Creation Limiter (Strict: 6 per hour)
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 6,
  message: {
    message: "Too many accounts created from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Login Limiter (10 per 15 minutes)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Score Submission Limiter (5 per minute)
export const scoreLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message: "Please wait a moment before saving another score",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. Global API Limiter (100 per hour)
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 5. Speed Bump (Slow down bots without blocking them)
export const apiSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: () => 500, // begin adding 500ms of delay per request
});

// 6. AI Generation Limiter (Placeholder: 5 per minute)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message: "AI generation limit reached. Please wait a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
