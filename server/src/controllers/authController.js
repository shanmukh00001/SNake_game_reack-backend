import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import logger from "../utils/logger.js";
import { z } from "zod";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecretkey", {
    expiresIn: "7d",
  });
};

const GoogleAuthSchema = z.object({
  token: z.string().min(10, "Google token is required"),
});

const UpdateNameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(30),
});

/**
 * Handles Google OAuth login & account sync
 */
export const googleAuth = async (req, res) => {
  try {
    const parseResult = GoogleAuthSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ success: false, message: parseResult.error.issues[0].message });
    }

    const { token } = parseResult.data;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Google token payload" });
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        provider: "google",
      });
      logger.info(`New user created via Google OAuth: ${email}`);
    } else {
      user.name = name || user.name;
      user.picture = picture || user.picture;
      await user.save();
      logger.info(`Existing user logged in via Google OAuth: ${email}`);
    }

    return res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      highScore: user.highScore,
      nameChangeCount: user.nameChangeCount,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    logger.error(`Google OAuth login failed: ${error.message}`);
    return res.status(401).json({ success: false, message: "Invalid Google token" });
  }
};

/**
 * Updates player name (limited to 1 change)
 */
export const updateName = async (req, res) => {
  try {
    const parseResult = UpdateNameSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ success: false, message: parseResult.error.issues[0].message });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.nameChangeCount > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Name can only be changed once" });
    }

    user.name = parseResult.data.name.trim();
    user.nameChangeCount += 1;
    await user.save();

    logger.info(`User ${user.email} updated name to: ${user.name}`);

    return res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      highScore: user.highScore,
      nameChangeCount: user.nameChangeCount,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    logger.error(`Name update failed: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Fetches current authenticated user profile
 */
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(req.user._id).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      highScore: user.highScore,
      nameChangeCount: user.nameChangeCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
