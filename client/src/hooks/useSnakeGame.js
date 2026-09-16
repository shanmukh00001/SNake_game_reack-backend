import { useState, useEffect, useRef, useCallback } from "react";
import { SnakeEngine } from "../engine/SnakeEngine.js";
import { audioEngine } from "../engine/AudioEngine.js";
import { GAME_STATUS } from "../engine/Constants.js";

/**
 * Custom React Hook bridging React lifecycle with pure SnakeEngine.
 * Renders state discretely (score, status, speed) while simulation loops outside React.
 *
 * @param {Object} [options={}]
 * @param {number} [options.seed]
 * @param {(stats: import('../engine/Types').GameOverStats) => void} [options.onGameOver]
 */
export function useSnakeGame({ seed, onGameOver } = {}) {
  const [score, setScore] = useState(0);
  const [speedLevel, setSpeedLevel] = useState(1);
  const [status, setStatus] = useState(GAME_STATUS.READY);
  const [isMuted, setIsMuted] = useState(() => audioEngine.isMuted());

  const engineRef = useRef(null);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() => {
    const engine = new SnakeEngine({
      seed,
      events: {
        onScoreChange: (newScore) => {
          setScore(newScore);
          setSpeedLevel(Math.max(1, Math.floor(newScore / 30) + 1));
        },
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
        },
        onEat: () => {
          audioEngine.playEat();
        },
        onDie: (stats) => {
          if (stats.reason === "win") {
            audioEngine.playWin();
          } else {
            audioEngine.playDie();
          }
          if (onGameOverRef.current) {
            onGameOverRef.current(stats);
          }
        },
        onTurn: () => {
          audioEngine.playTurn();
        },
      },
    });

    engineRef.current = engine;
    setStatus(engine.status);
    setScore(engine.score);

    return () => {
      engine.destroy();
    };
  }, [seed]);

  const handleDirection = useCallback((dir) => {
    if (engineRef.current) {
      engineRef.current.handleInput(dir);
    }
  }, []);

  const togglePause = useCallback(() => {
    if (engineRef.current) {
      audioEngine.playClick();
      engineRef.current.togglePause();
    }
  }, []);

  const resetGame = useCallback((newSeed) => {
    if (engineRef.current) {
      audioEngine.playClick();
      engineRef.current.reset(newSeed);
      setScore(0);
      setSpeedLevel(1);
    }
  }, []);

  const start = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.start();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  return {
    engine: engineRef.current,
    score,
    speedLevel,
    status,
    handleDirection,
    togglePause,
    resetGame,
    start,
    isMuted,
    toggleMute,
    GAME_STATUS,
  };
}
