import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Initialize from localStorage on mount (preserves session across refresh)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored?.token || stored?.isGuest) {
        setUser(stored);
        setToken(stored.token || null);
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

  // Login as Guest: persists a guest object in localStorage
  const loginAsGuest = () => {
    const guestData = { name: "Guest", isGuest: true };
    localStorage.setItem("user", JSON.stringify(guestData));
    setUser(guestData);
    setToken(null);
  };

  // Logout: clears storage and state
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  // Update user data (e.g. after name change)
  const updateUser = (newData) => {
    const updated = { ...user, ...newData };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginAsGuest, logout, updateUser }}>
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
