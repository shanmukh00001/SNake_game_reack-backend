import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import { createInitialState, stepGame, GRID_SIZE, TICK_MS } from "../gameLogic";

export default function Game() {
  const [gameState, setGameState] = useState(() => createInitialState());
  const requestedDirRef = useRef(gameState.direction);
  const hasSubmittedScore = useRef(false);

  const sendScore = async (finalScore) => {
    try {
      await API.post("/score", { score: finalScore });
      console.log("Score saved");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGameState((prevState) => {
        if (prevState.status === "gameover" || prevState.status === "won") {
          return prevState;
        }

        const nextState = stepGame(prevState, requestedDirRef.current);
        
        if ((nextState.status === "gameover" || nextState.status === "won") && !hasSubmittedScore.current) {
          hasSubmittedScore.current = true;
          sendScore(nextState.score);
        }
        
        return nextState;
      });
    }, TICK_MS);

    return () => clearInterval(gameLoop);
  }, []);

  const handleManualDirection = (reqDir) => {
    if (gameState.status === "ready") {
      setGameState(prev => ({ ...prev, status: "running" }));
    }
    requestedDirRef.current = reqDir;
  };

  useEffect(() => {
    const handleKey = (e) => {
      if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
          e.preventDefault();
      }

      if (gameState.status === "ready" && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        setGameState(prev => ({ ...prev, status: "running" }));
      }
      
      if (e.key === "ArrowUp") requestedDirRef.current = "UP";
      if (e.key === "ArrowDown") requestedDirRef.current = "DOWN";
      if (e.key === "ArrowLeft") requestedDirRef.current = "LEFT";
      if (e.key === "ArrowRight") requestedDirRef.current = "RIGHT";
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState.status]);

  const resetGame = () => {
    setGameState(createInitialState());
    requestedDirRef.current = "RIGHT";
    hasSubmittedScore.current = false;
  };

  // Build grid
  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isHead = gameState.snake[0].x === x && gameState.snake[0].y === y;
      const isSnake = !isHead && gameState.snake.some(s => s.x === x && s.y === y);
      const isFood = gameState.food && gameState.food.x === x && gameState.food.y === y;
      
      let className = "cell";
      if (isHead) className += " head";
      else if (isSnake) className += " snake";
      else if (isFood) className += " food";
      
      cells.push(<div key={`${x}-${y}`} className={className}></div>);
    }
  }

  return (
    <>
      <div className="status-row">
        <div className="scorecard">
          <p className="scorecard-label">CURRENT SCORE</p>
          <strong>{gameState.score}</strong>
        </div>
        <div>
          <p id="status">
            {gameState.status === 'ready' && "Press a direction key or arrow to begin."}
            {gameState.status === 'gameover' && "Game Over! Try again."}
            {gameState.status === 'won' && "You win!"}
            {gameState.status === 'running' && "Good luck..."}
          </p>
          {(gameState.status === "gameover" || gameState.status === "won") && (
            <div className="actions">
              <button onClick={resetGame}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="board">
        {cells}
      </div>

      <div className="controls">
        <button className="control up" onClick={() => handleManualDirection('UP')}>↑</button>
        <button className="control left" onClick={() => handleManualDirection('LEFT')}>←</button>
        <button className="control down" onClick={() => handleManualDirection('DOWN')}>↓</button>
        <button className="control right" onClick={() => handleManualDirection('RIGHT')}>→</button>
      </div>
    </>
  );
}