import { useEffect, useState, useCallback } from "react";
import API from "../../services/api.js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Trophy, RotateCw, Crown, Medal, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Competitive Leaderboard Card displaying Top 10 Hall of Fame rankings.
 */
export default function LeaderboardCard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("leaderboard");
      if (Array.isArray(res.data?.data?.items)) {
        setData(res.data.data.items);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load global rankings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <Badge variant="gold" className="gap-1 px-1.5 py-0.5">
          <Crown className="w-3 h-3 text-amber-400" /> #1
        </Badge>
      );
    }
    if (rank === 2) {
      return (
        <Badge variant="silver" className="gap-1 px-1.5 py-0.5">
          <Medal className="w-3 h-3 text-slate-300" /> #2
        </Badge>
      );
    }
    if (rank === 3) {
      return (
        <Badge variant="bronze" className="gap-1 px-1.5 py-0.5">
          <Medal className="w-3 h-3 text-amber-600" /> #3
        </Badge>
      );
    }
    return (
      <span className="font-mono text-xs font-bold text-slate-500 w-6 text-center">
        #{rank}
      </span>
    );
  };

  return (
    <Card className="w-full border-slate-700/80 bg-slate-900/90 shadow-2xl rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3.5 border-b border-slate-700/80 p-4 sm:p-5">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm font-bold font-mono tracking-wider uppercase text-slate-100">
            <Trophy className="w-4 h-4 text-amber-400" /> HALL OF RECORDS
          </CardTitle>
          <CardDescription className="text-slate-400 text-[10px] font-mono mt-0.5">
            GLOBAL TOURNAMENT TIER 01
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchLeaderboard}
          disabled={loading}
          className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Refresh Leaderboard"
        >
          <RotateCw
            className={`w-3.5 h-3.5 ${
              loading ? "animate-spin text-emerald-400" : ""
            }`}
          />
        </Button>
      </CardHeader>

      <CardContent className="p-3 sm:p-4">
        {loading && data.length === 0 ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-9 rounded-lg bg-slate-800 animate-pulse border border-slate-700/50"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-xs gap-2">
            <p className="text-rose-400 font-mono">{error}</p>
            <Button variant="secondary" size="sm" onClick={fetchLeaderboard}>
              Try Again
            </Button>
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-1.5">
            {data.slice(0, 10).map((player, idx) => {
              const rank = player.rank || idx + 1;
              const isCurrentPlayer =
                user?.name &&
                player.name?.toLowerCase() === user.name?.toLowerCase();

              return (
                <div
                  key={player.name + rank}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-xs font-mono border ${
                    isCurrentPlayer
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm"
                      : "bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/70 text-slate-100 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 font-bold ${
                        rank === 1
                          ? "text-amber-400"
                          : rank === 2
                          ? "text-slate-300"
                          : rank === 3
                          ? "text-orange-400"
                          : "text-slate-400"
                      }`}
                    >
                      {String(rank).padStart(2, "0")}
                    </span>

                    <div className="flex items-center gap-2 truncate">
                      <span className="truncate font-sans font-medium text-xs text-slate-100">
                        {player.name || "Operator"}
                      </span>
                      {isCurrentPlayer && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-300 font-mono font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-mono font-bold tracking-tight text-white text-xs bg-slate-900/60 px-2 py-1 rounded border border-slate-700/50">
                    {(player.highScore || 0).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-xs text-center font-mono">
            <Trophy className="w-6 h-6 text-slate-500 mb-1.5" />
            <span>NO RECORDS LOGGED YET</span>
            <span className="text-slate-400 mt-0.5">COMMENCE A RUN TO QUALIFY</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
