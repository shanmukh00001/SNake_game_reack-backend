import { useEffect, useState } from "react";
import API from "../services/api";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await API.get("/leaderboard");
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="card">
      <div className="leaderboard-header">
        <h2>Top Players</h2>
        <button 
          className="refresh-btn" 
          onClick={fetchLeaderboard}
          disabled={loading}
        >
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {loading && data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <span className="spinner"></span>
        </div>
      ) : data.length > 0 ? (
        <div className="leaderboard-list">
          {data.map((user) => (
            <div 
              key={user.rank || user.email} 
              className={`leaderboard-item rank-${user.rank}`}
            >
              <div className="rank-info">
                <span className="rank">
                  {getRankMedal(user.rank)}
                </span>
                <span className="player-email">
                  {user.email.split('@')[0]}
                  {/* Just showing the first part of email for privacy/cleanliness in game UI */}
                </span>
              </div>
              <span className="player-score">{user.highScore.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No scores yet. Be the first!
        </div>
      )}
    </div>
  );
}