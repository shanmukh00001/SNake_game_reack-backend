import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Leaderboard from "./components/Leaderboard";
import Game from "./pages/Game";
import "./App.css";

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app-container">
      <header className="header">
        <h1>Katre THe BUSSS__..</h1>
        {user && (
          <div className="user-controls">
            <span className="text-muted">Logged in as: <span className="text-primary">{user.email}</span></span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="main-content">
        <section className="left-column">
          {!user ? <Login /> : <Game />}
        </section>
        
        <section className="right-column">
          <Leaderboard />
        </section>
      </main>
    </div>
  );
}

export default App;