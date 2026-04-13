import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Leaderboard from "./components/Leaderboard";
import Game from "./pages/Game";

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <div className="panel">
        <header className="topbar">
          <div>
            <h1>Katre THe BUSSS_..</h1>
            <p className="eyebrow">
              {user ? `Logged in as: ${user.email}` : "Please log in"}
            </p>
          </div>
          {user && (
            <div className="actions">
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </header>

        {/* Adding an empty element here as spacing if needed could be done, but we'll let CSS gaps or standard margins handle layout naturally */}
        <br />

        <main className="layout">
          <section className="game-area">
            {!user ? <Login /> : <Game />}
          </section>
          
          <aside className="sidebar">
            <Leaderboard />
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;