import logger from "../utils/logger.js";

/**
 * 404 Not Found Middleware
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  logger.error(`[Error Handler]: ${err.message}`, { stack: err.stack, path: req.path });

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
