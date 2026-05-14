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
      <div className="leaderboard-header">
        <h2 className="auth-form-title">Top Players</h2>
        <button 
          className="refresh-btn"
          onClick={fetchLeaderboard}
          disabled={loading}
        >
          {loading ? <span className="spinner"></span> : "Refresh"}
        </button>
      </div>

      <div className="leaderboard-list">
        {loading && data.length === 0 ? (
          <p className="empty-state">Loading scores...</p>
        ) : data.length > 0 ? (
          <>
            {data.map((user) => (
              <div key={user.rank || user.name} className={`leaderboard-item rank-${user.rank}`}>
                <div className="rank-info">
                  <span className="rank">{getRankMedal(user.rank)}</span>
                  <span className="player-name">{user.name}</span>
                </div>
                
                <span className="player-score">{(user.highScore || 0).toLocaleString()}</span>
              </div>
            ))}
          </>
        ) : (
          <p className="empty-state">
            No scores yet. Be the first!
          </p>
        )}
      </div>
    </div>
  );
}