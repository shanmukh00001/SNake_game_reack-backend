import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Initialize from localStorage on mount (preserves session across refresh)
  useEffect(() => {
    const syncUser = async (token) => {
      try {
        const { data } = await API.get("auth/me");
        // Maintain the token in the user object
        updateUser({ ...data, token });
      } catch (err) {
        console.error("Failed to sync user data:", err);
      }
    };

    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored?.token || stored?.isGuest) {
        setUser(stored);
        setToken(stored.token || null);
        
        if (stored.token) {
          syncUser(stored.token);
        }
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
    setUser(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
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

