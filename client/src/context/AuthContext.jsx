import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Initialize from localStorage on mount (preserves session across refresh)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored?.token) {
        setUser(stored);
        setToken(stored.token);
      }
    } catch {
      localStorage.removeItem("user");
    }
  }, []);

  // Login: stores to localStorage (same format as before) and updates state
  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setToken(data.token);
  };

  // Logout: clears storage and state
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
