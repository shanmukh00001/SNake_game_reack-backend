import { useEffect, useState } from "react";
import API from "../services/api";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/leaderboard");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // Load once on mount
 useEffect(() => {
  const load = async () => {
    await fetchLeaderboard();
  };

  load();
}, []);
  return (
    <div>
      <h2>Leaderboard</h2>

      <button onClick={fetchLeaderboard}>Refresh</button>

      {data && data.length > 0 ? (
        data.map((user) => (
          <div key={user.rank}>
            #{user.rank} {user.email} — {user.highScore}
          </div>
        ))
      ) : (
        <p>No data</p>
      )}
    </div>
  );
}