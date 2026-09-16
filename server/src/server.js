import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import logger from "./utils/logger.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { apiLimiter, apiSlowDown } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";

dotenv.config();
export const app = express();

// Request logging for debugging & audit trail
app.use((req, _res, next) => {
  logger.info(
    `Incoming Request: ${req.method} ${req.originalUrl} | Origin: ${
      req.headers.origin || "Direct"
    }`
  );
  next();
});

// Production & Development CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        process.env.NODE_ENV === "development" ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.some(
          (allowed) => allowed.replace(/\/$/, "") === origin.replace(/\/$/, "")
        )
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: Request origin not allowed"));
    },
    credentials: true,
  })
);

// Configure Helmet with secure Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://accounts.google.com"],
      connectSrc: [
        "'self'",
        "http://localhost:5000",
        "https://accounts.google.com",
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
      ],
      frameSrc: ["'self'", "https://accounts.google.com"],
      imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"],
    },
  })
);

app.use(hpp());
app.use(express.json({ limit: "100kb" }));

// Rate limiting & slow down
app.use("/api", apiLimiter);
app.use("/api", apiSlowDown);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", scoreRoutes);

// Handle browser favicon requests silently
app.get("/favicon.ico", (_req, res) => res.status(204).end());

// Root health check endpoint
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Snake Game API is running successfully",
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/snakeDB";
  mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      logger.info("MongoDB connected successfully");
      const server = app.listen(PORT, () => {
        logger.info(
          `Server running in ${
            process.env.NODE_ENV || "development"
          } mode on port ${PORT}`
        );
      });

      // Graceful termination handling
      const shutdown = () => {
        logger.info("Shutdown signal received. Closing HTTP server...");
        server.close(async () => {
          logger.info("HTTP server closed. Disconnecting database...");
          await mongoose.disconnect();
          process.exit(0);
        });
      };

      process.on("SIGTERM", shutdown);
      process.on("SIGINT", shutdown);
    })
    .catch((err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
      process.exit(1);
    });
}
