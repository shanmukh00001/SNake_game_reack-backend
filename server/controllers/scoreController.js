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
      .select("name email picture highScore")
      .sort({ highScore: -1 })
      .limit(3);

    const leaderboard = users.map((user, index) => {
      // Safely extract a display name
      const displayName = user.name || (user.email ? user.email.split("@")[0] : "Hidden User");
      
      return {
        rank: index + 1,
        name: displayName,
        picture: user.picture || null,
        highScore: user.highScore || 0,
      };
    });

    res.json(leaderboard);
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
  }
};