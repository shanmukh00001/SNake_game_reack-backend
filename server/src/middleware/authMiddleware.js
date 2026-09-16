import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protect middleware: Verifies JWT bearer token and sets req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecretkey"
      );
      const user = await User.findById(decoded.id);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found for this token" });
      }

      req.user = user;
      return next();
    } catch {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  return res
    .status(401)
    .json({ success: false, message: "No token provided, not authorized" });
};
