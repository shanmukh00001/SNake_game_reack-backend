import { useEffect, useRef, useState } from "react";
import API from "../services/api";

export default function Game() {
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gridSize = 20;

  // ✅ Persistent game state
  const snake = useRef([{ x: 10, y: 10 }]);
  const direction = useRef({ x: 1, y: 0 });
  const food = useRef({ x: 5, y: 5 });

  // ✅ FIX: define BEFORE useEffect (no hoisting error)
  const sendScore = async (finalScore) => {
    try {
      await API.post("/scores", { score: finalScore });
      console.log("Score saved");
    } catch (err) {
      console.error(err);
    }
  };

  // 🎮 Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const gameLoop = setInterval(() => {
      if (gameOver) return;

      const newHead = {
        x: snake.current[0].x + direction.current.x,
        y: snake.current[0].y + direction.current.y,
      };

      // ❌ Wall collision
      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= canvas.width / gridSize ||
        newHead.y >= canvas.height / gridSize
      ) {
        setGameOver(true);
        sendScore(score); // ✅ now safe
        return;
      }

      snake.current.unshift(newHead);

      // 🍎 Eat food
      if (
        newHead.x === food.current.x &&
        newHead.y === food.current.y
      ) {
        setScore((prev) => prev + 10);

        food.current = {
          x: Math.floor(Math.random() * (canvas.width / gridSize)),
          y: Math.floor(Math.random() * (canvas.height / gridSize)),
        };
      } else {
        snake.current.pop();
      }

      // 🎨 Draw
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "green";
      snake.current.forEach((s) => {
        ctx.fillRect(
          s.x * gridSize,
          s.y * gridSize,
          gridSize,
          gridSize
        );
      });

      ctx.fillStyle = "red";
      ctx.fillRect(
        food.current.x * gridSize,
        food.current.y * gridSize,
        gridSize,
        gridSize
      );
    }, 150);

    return () => clearInterval(gameLoop);
  }, [gameOver]); // ✅ no multiple intervals

  // 🎮 Controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") direction.current = { x: 0, y: -1 };
      if (e.key === "ArrowDown") direction.current = { x: 0, y: 1 };
      if (e.key === "ArrowLeft") direction.current = { x: -1, y: 0 };
      if (e.key === "ArrowRight") direction.current = { x: 1, y: 0 };
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const restart = () => {
    window.location.reload();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Snake Game</h2>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "2px solid white" }}
      />

      <p>Score: {score}</p>

      {gameOver && (
        <div>
          <h3>Game Over</h3>
          <button onClick={restart}>Restart</button>
        </div>
      )}
    </div>
  );
}