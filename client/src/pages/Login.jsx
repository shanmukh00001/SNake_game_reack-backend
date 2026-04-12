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
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await API.post(endpoint, { email, password });
      
      setMessage({ 
        text: isLogin ? "Login successful!" : "Registration successful! Logging in...", 
        type: "success" 
      });

      // Give a tiny delay so the user can read the success message before it unmounts
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
    <div className="auth-container">
      <div className="card">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-muted">
            {isLogin ? "Enter your credentials to play" : "Sign up to start posting scores"}
          </p>
        </div>

        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <input 
              type="email"
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
          <span className="text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            type="button" 
            style={{ 
              background: "none", 
              border: "none", 
              color: "var(--accent-primary)", 
              padding: 0,
              boxShadow: "none",
              fontWeight: 600,
            }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}