import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import logger from "../utils/logger.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT for session
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Auth user with Google OAuth
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Find or create user
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
      // Update profile data in case it changed
      user.name = name;
      user.picture = picture;
      await user.save();
      logger.info(`Existing user logged in via Google OAuth: ${email}`);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      highScore: user.highScore,
      nameChangeCount: user.nameChangeCount,
      token: generateToken(user._id),
    });
  } catch (error) {
    logger.error(`Google OAuth login failed: ${error.message}`);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

// @desc    Update user name (ONE TIME ONLY)
// @route   PUT /api/auth/update-name
// @access  Private
export const updateName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Please provide a valid name" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.nameChangeCount > 0) {
      return res.status(400).json({ message: "Name can only be changed once" });
    }

    user.name = name.trim();
    user.nameChangeCount += 1;
    await user.save();

    logger.info(`User ${user.email} updated name to: ${user.name}`);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      highScore: user.highScore,
      nameChangeCount: user.nameChangeCount,
      token: generateToken(user._id),
    });
  } catch (error) {
    logger.error(`Name update failed for ${req.user?._id}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};