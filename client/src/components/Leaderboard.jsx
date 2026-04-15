import { useEffect, useState } from "react";
import API from "../services/api";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await API.get("leaderboard");
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
    <div className="score-summary">
      <div className="topbar">
        <h2 className="auth-form-title">Top Players</h2>
        <button 
          onClick={fetchLeaderboard}
          disabled={loading}
        >
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      <div className="status-row">
        {loading && data.length === 0 ? (
          <p className="hint">Loading...</p>
        ) : data.length > 0 ? (
          <>
            {data.map((user) => (
              <div key={user.rank || user.name} className="leaderboard-item">
                <div className="rank-info">
                  <span className="rank">{getRankMedal(user.rank)}</span>
                  <span className="player-name">{user.name}</span>
                </div>
                
                <span className="player-score">{user.highScore.toLocaleString()}</span>
              </div>
            ))}
          </>
        ) : (
          <p className="hint">
            No scores yet. Be the first!
          </p>
        )}
      </div>
    </div>
  );
}