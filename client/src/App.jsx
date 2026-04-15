import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Leaderboard from "./components/Leaderboard";
import Game from "./pages/Game";
import API from "./services/api";

function App() {
  const { user, logout, updateUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const isGuest = user?.isGuest;

  const handleNameUpdate = async () => {
    try {
      const { data } = await API.put("auth/update-name", { name: newName });
      updateUser(data);
      setIsEditingName(false);
      setNewName("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update name");
    }
  };

  return (
    <div className="app">
      <div className="panel">
        <header className="topbar">
          <div>
            <h1>Katre THe BUSSS_..</h1>
            <div className="user-profile">
              <div className="name-container">
                <p className="eyebrow">
                  {isGuest ? (
                    <>Playing as: <span className="current-name guest-tag">Guest</span></>
                  ) : (
                    <>Logged in as: <span className="current-name">{user ? (user.name || user.email) : "Please log in"}</span></>
                  )}
                </p>
                {user && !isGuest && user.nameChangeCount === 0 && (
                  <button 
                    className="edit-name-btn" 
                    onClick={() => setIsEditingName(true)}
                    title="Change name (one time only)"
                  >
                    ✎
                  </button>
                )}
              </div>
            </div>
          </div>
          {user && (
            <div className="actions">
              {isGuest && (
                <span className="guest-badge">Guest Mode</span>
              )}
              <button className="logout-btn" onClick={logout}>
                {isGuest ? "Exit Guest" : "Logout"}
              </button>
            </div>
          )}
        </header>

        {isEditingName && (
          <div className="name-edit-overlay">
            <div className="name-edit-card">
              <h3>Change Your Name</h3>
              <p className="hint">This can only be done once!</p>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Enter new name..."
                autoFocus
              />
              <div className="edit-actions">
                <button className="cancel-link" onClick={() => setIsEditingName(false)}>Cancel</button>
                <button 
                  className="save-btn" 
                  onClick={handleNameUpdate}
                  disabled={!newName.trim() || newName.trim().length < 2}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

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