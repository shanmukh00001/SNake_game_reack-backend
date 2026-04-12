import Login from "./pages/Login";
import Leaderboard from "./components/Leaderboard";
import Game from "./pages/Game";

function App() {
  return (
    <div>
      <h1>Snake Game</h1>
      <Login />
      <Game />
      <Leaderboard />
    </div>
  );
}

export default App;