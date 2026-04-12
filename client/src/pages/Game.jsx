import { useEffect, useRef, useState } from "react";
import API from "../services/api";

export default function Game() {
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gridSize = 20;

  // Persistent game state
  const snake = useRef([{ x: 10, y: 10 }]);
  const direction = useRef({ x: 1, y: 0 });
  const food = useRef({ x: 5, y: 5 });

  const sendScore = async (finalScore) => {
    try {
      await API.post("/score", { score: finalScore });
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
        sendScore(score);
        return;
      }

      // ❌ Self collision
      for (let i = 0; i < snake.current.length; i++) {
        if (newHead.x === snake.current[i].x && newHead.y === snake.current[i].y) {
          setGameOver(true);
          sendScore(score);
          return;
        }
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
      ctx.fillStyle = "#000000"; // Black background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Snake
      snake.current.forEach((s, index) => {
        ctx.fillStyle = index === 0 ? "#00ff87" : "#00cc6a"; // Neon green head, slightly darker body
        ctx.fillRect(
          s.x * gridSize,
          s.y * gridSize,
          gridSize - 1, // small gap between segments
          gridSize - 1
        );
      });

      // Draw Food
      ctx.fillStyle = "#ef4444"; // Red
      ctx.beginPath();
      ctx.arc(
        food.current.x * gridSize + gridSize / 2,
        food.current.y * gridSize + gridSize / 2,
        gridSize / 2 - 2, // slightly smaller than grid
        0,
        2 * Math.PI
      );
      ctx.fill();

    }, 120); // Slightly faster for better feel

    return () => clearInterval(gameLoop);
  }, [gameOver, score]);

  // 🎮 Controls
  useEffect(() => {
    const handleKey = (e) => {
      // Prevent scrolling with arrows
      if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
          e.preventDefault();
      }
      
      if (e.key === "ArrowUp" && direction.current.y !== 1) direction.current = { x: 0, y: -1 };
      if (e.key === "ArrowDown" && direction.current.y !== -1) direction.current = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && direction.current.x !== 1) direction.current = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && direction.current.x !== -1) direction.current = { x: 1, y: 0 };
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const resetGame = () => {
    snake.current = [{ x: 10, y: 10 }];
    direction.current = { x: 1, y: 0 };
    food.current = { 
      x: Math.floor(Math.random() * (400 / gridSize)), 
      y: Math.floor(Math.random() * (400 / gridSize)) 
    };
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="card game-card">
      <div className="score-display">
        Score: <span className="score-value">{score}</span>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
        />

        {gameOver && (
          <div className="game-overlay">
            <h3 className="game-over-title">Game Over</h3>
            <div className="final-score">
              Final Score: <span>{score}</span>
            </div>
            <button onClick={resetGame} style={{ marginTop: '1rem' }}>
              Play Again
            </button>
          </div>
        )}
      </div>
      
      <p className="text-muted" style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
        Use Arrow Keys to move
      </p>
    </div>
  );
}