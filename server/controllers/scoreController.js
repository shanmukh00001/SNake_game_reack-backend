import User from "../models/User.js";

// SAVE SCORE
export const saveScore = async (req, res) => {
  try {
    const { score } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
    }

    res.json({
      message: "Score updated",
      highScore: user.highScore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LEADERBOARD
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .select("email highScore")
      .sort({ highScore: -1 })
      .limit(10);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      email: user.email,
      highScore: user.highScore,
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};