import { useEffect, useRef, useState, useCallback } from "react";
import API from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useSnakeGame } from "../hooks/useSnakeGame.js";
import CanvasBoard from "../components/game/CanvasBoard.jsx";
import GameHUD from "../components/game/GameHUD.jsx";
import GameOverModal from "../components/game/GameOverModal.jsx";
import GamePauseModal from "../components/game/GamePauseModal.jsx";
import GameControls from "../components/game/GameControls.jsx";
import { Button } from "../components/ui/Button.jsx";
import { audioEngine } from "../engine/AudioEngine.js";
import { Play } from "lucide-react";

/**
 * Main Interactive Game Screen Component.
 *
 * @param {Object} props
 * @param {() => void} [props.onOpenSettings]
 */
export default function GamePage({ onOpenSettings, rightSlot }) {
  const { user, updateUser } = useAuth();
  const isGuest = user?.isGuest;

  const [sessionId, setSessionId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [sessionSeed, setSessionSeed] = useState(undefined);
  const [submissionError, setSubmissionError] = useState("");
  const [lastStats, setLastStats] = useState(null);

  const startServerSession = useCallback(async () => {
    if (isGuest) return;
    try {
      const res = await API.post("games/session/start");
      if (res.data?.data?.sessionId) {
        setSessionId(res.data.data.sessionId);
        setSessionToken(res.data.data.sessionToken);
        setSessionSeed(res.data.data.seed);
      }
    } catch {
      try {
        const res = await API.post("session/start");
        if (res.data?.sessionToken) {
          setSessionToken(res.data.sessionToken);
        }
      } catch (err) {
        console.warn("Could not obtain server session token:", err);
      }
    }
  }, [isGuest]);

  useEffect(() => {
    startServerSession();
  }, [startServerSession]);

  const handleGameOverCallback = async (stats) => {
    setLastStats(stats);
    const finalScore = stats.score;

    if (isGuest) {
      const currentGuestBest = parseInt(
        localStorage.getItem("guest_highscore") || "0",
        10
      );
      if (finalScore > currentGuestBest) {
        localStorage.setItem("guest_highscore", finalScore.toString());
      }
      return;
    }

    try {
      setSubmissionError("");
      const payload = {
        sessionId,
        sessionToken,
        score: finalScore,
        foodEaten: stats.foodCount,
        movesCount: stats.moveCount,
        durationMs: stats.durationMs,
        inputLog: stats.inputLog,
      };

      try {
        const { data } = await API.post("games/session/submit", payload);
        if (data.data?.personalBest !== undefined) {
          updateUser({ highScore: data.data.personalBest });
        }
      } catch {
        const { data } = await API.post("score", payload);
        if (data.highScore !== undefined) {
          updateUser({ highScore: data.highScore });
        }
      }
    } catch (err) {
      setSubmissionError(
        err.response?.data?.message || "Score submission failed"
      );
    }
  };

  const {
    engine,
    score,
    speedLevel,
    status,
    handleDirection,
    togglePause,
    resetGame,
    isMuted,
    toggleMute,
    GAME_STATUS,
  } = useSnakeGame({
    seed: sessionSeed,
    onGameOver: handleGameOverCallback,
  });

  // Swipe gesture handling with threshold
  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < 25) return;

    if (absDx > absDy) {
      handleDirection(dx > 0 ? "RIGHT" : "LEFT");
    } else {
      handleDirection(dy > 0 ? "DOWN" : "UP");
    }
  };

  const onPlayAgain = useCallback(() => {
    startServerSession();
    resetGame(sessionSeed);
  }, [startServerSession, resetGame, sessionSeed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }

      if (e.code === "Space" || e.code === "Escape") {
        togglePause();
        return;
      }

      if (e.key === "r" || e.key === "R") {
        audioEngine.playClick();
        onPlayAgain();
        return;
      }

      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        handleDirection("UP");
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        handleDirection("DOWN");
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        handleDirection("LEFT");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        handleDirection("RIGHT");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDirection, togglePause, onPlayAgain]);

  const guestHighScore = localStorage.getItem("guest_highscore") || "0";
  const personalBest = isGuest ? guestHighScore : user?.highScore || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 w-full items-start">
      {/* Screen Reader Live Announcement */}
      <div className="sr-only" aria-live="polite">
        {status === GAME_STATUS.GAMEOVER &&
          `Game over. Final score is ${score}`}
        {status === GAME_STATUS.PAUSED && "Game paused"}
      </div>

      {/* LEFT COLUMN: Game Board Arena */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div
          className="relative w-full flex justify-center items-center rounded-2xl border border-slate-700/60 bg-[#07080a] p-2.5 sm:p-3.5 shadow-xl shadow-black/60"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <CanvasBoard engine={engine} />

          {/* READY / INITIATE Overlay */}
          {status === GAME_STATUS.READY && (
            <div className="absolute inset-0 bg-[#090a0c]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="flex flex-col items-center gap-3 max-w-xs bg-[#12151a] border border-[#232934] p-5 rounded">
                <div className="w-10 h-10 rounded bg-[#181c23] border border-[#232934] flex items-center justify-center text-[#10b981]">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#94a3b8] uppercase tracking-widest block">
                    STANDBY // ENGAGE
                  </span>
                  <h2 className="text-lg font-bold font-display text-[#f8fafc]">
                    Initiate Session
                  </h2>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Direct the living phosphor matrix. Collect terracotta tokens and ramp velocity.
                </p>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#94a3b8]">
                  <span className="px-1.5 py-0.5 bg-[#181c23] border border-[#232934] rounded text-[#f8fafc] font-bold">
                    WASD
                  </span>
                  <span>OR</span>
                  <span className="px-1.5 py-0.5 bg-[#181c23] border border-[#232934] rounded text-[#f8fafc] font-bold">
                    ARROWS
                  </span>
                </div>
                <Button
                  variant="default"
                  size="default"
                  className="w-full gap-2 mt-1"
                  onClick={() => {
                    audioEngine.playClick();
                    handleDirection("RIGHT");
                  }}
                >
                  COMMENCE RUN
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: HUD Telemetry, Quick Controls, and Leaderboard */}
      <div className="lg:col-span-5 flex flex-col gap-4 w-full">
        {/* Game HUD (Score, Status, Controls) */}
        <GameHUD
          score={score}
          personalBest={personalBest}
          speedLevel={speedLevel}
          status={status}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onTogglePause={togglePause}
          onReset={onPlayAgain}
          onOpenSettings={onOpenSettings}
        />

        {/* Responsive Touch Controls */}
        <GameControls onDirection={handleDirection} />

        {/* Supplementary Content Slot (Leaderboard, etc.) */}
        {rightSlot}
      </div>

      {/* PAUSED Accessible Dialog */}
      <GamePauseModal
        isOpen={status === GAME_STATUS.PAUSED}
        onResume={togglePause}
      />

      {/* GAME OVER Accessible Dialog */}
      <GameOverModal
        isOpen={status === GAME_STATUS.GAMEOVER}
        score={score}
        personalBest={personalBest}
        foodEaten={lastStats?.foodCount}
        durationMs={lastStats?.durationMs}
        isGuest={isGuest}
        error={submissionError}
        onPlayAgain={onPlayAgain}
      />

      {/* WON Accessible Dialog */}
      <GameOverModal
        isOpen={status === GAME_STATUS.WON}
        score={score}
        personalBest={personalBest}
        foodEaten={lastStats?.foodCount}
        durationMs={lastStats?.durationMs}
        isWon={true}
        isGuest={isGuest}
        error={submissionError}
        onPlayAgain={onPlayAgain}
      />

      {/* Responsive Touch Controls */}
      <GameControls onDirection={handleDirection} />
    </div>
  );
}
