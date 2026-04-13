import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const endpoint = isLogin ? "auth/login" : "auth/register";
      const { data } = await API.post(endpoint, { email, password });
      
      setMessage({ 
        text: isLogin ? "Login successful!" : "Registration successful! Logging in...", 
        type: "success" 
      });

      setTimeout(() => {
        login(data);
      }, 500);
      
    } catch (err) {
      console.log(err);
      setMessage({ 
        text: err.response?.data?.error || "An error occurred", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div>
          <h2 className="auth-form-title">Welcome</h2>
          <p className="hint">
            Sign in to conquer the leaderboard
          </p>
        </div>
      </div>

      <div className="auth-tabs">
        <button 
          className={`auth-tab ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
          type="button"
        >
          Sign In
        </button>
        <button 
          className={`auth-tab ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
          type="button"
        >
          Register
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Email Address</label>
          <input 
            type="email"
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        
        <div className="field">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>

        {message.text && (
          <p className="auth-state" style={{ color: message.type === 'error' ? 'var(--food)' : 'var(--snake)' }}>
            {message.text}
          </p>
        )}
        
        <div className="auth-actions" style={{ marginTop: "8px" }}>
          <button id="primary-auth-button" type="submit" disabled={loading}>
            {loading ? "..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </div>
      </form>
    </div>
  );
}