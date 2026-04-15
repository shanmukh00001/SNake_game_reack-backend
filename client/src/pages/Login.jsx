import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function Login() {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const { login, loginAsGuest } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await API.post("auth/google", { 
        token: credentialResponse.credential 
      });
      
      setMessage({ 
        text: "Login successful!", 
        type: "success" 
      });

      setTimeout(() => {
        login(data);
      }, 500);
      
    } catch (err) {
      console.log(err);
      setMessage({ 
        text: err.response?.data?.message || "Google Authentication failed", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage({ text: "Google Sign-In failed. Please try again.", type: "error" });
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div>
          <h2 className="auth-form-title">Welcome</h2>
          <p className="hint">
            Sign in with Google to conquer the leaderboard
          </p>
        </div>
      </div>

      <div className="google-auth-container" style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "20px",
        margin: "30px 0" 
      }}>
        {loading ? (
          <p className="auth-state">Authenticating...</p>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_black"
            shape="pill"
          />
        )}
      </div>

      {message.text && (
        <p className="auth-state" style={{ 
          textAlign: "center",
          color: message.type === 'error' ? 'var(--food)' : 'var(--snake)' 
        }}>
          {message.text}
        </p>
      )}

      <div className="auth-divider">
        <span>or</span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
        <button
          id="play-as-guest-btn"
          className="guest-btn"
          onClick={loginAsGuest}
        >
          🎮 Play as Guest
        </button>
      </div>

      <div className="auth-footer" style={{ textAlign: "center", marginTop: "16px" }}>
        <p className="hint" style={{ fontSize: "0.8rem" }}>
          Sign in to save your high score to the leaderboard.
        </p>
      </div>
    </div>
  );
}