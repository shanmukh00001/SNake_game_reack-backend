import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import morgan from "morgan";
import logger from "./utils/logger.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { apiLimiter, apiSlowDown } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";

dotenv.config();
const app = express();

// Request Logger for Debugging
app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl} | Origin: ${req.headers.origin}`);
  next();
});

// Relaxed CORS for development
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === "development" ? true : allowedOrigins,
  credentials: true,
}));

// Configure Helmet to allow Google OAuth scripts
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://accounts.google.com"],
      connectSrc: ["'self'", "http://localhost:5000", "https://accounts.google.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"], // Allow Google profile pics
    },
  })
);

app.use(express.json());

// Global API Protection (Scraping and Abuse Prevention)
app.use("/api", apiLimiter);
app.use("/api", apiSlowDown);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", scoreRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

//Your frontend and backend run on different origins:Without this: Browser blocks request (CORS error)


const PORT = process.env.PORT || 5000;

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected successfully");
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });