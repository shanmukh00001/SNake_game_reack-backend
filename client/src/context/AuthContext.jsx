import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api.js";

/**
 * @typedef {Object} UserProfile
 * @property {string} [_id]
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} [picture]
 * @property {number} [highScore]
 * @property {number} [nameChangeCount]
 * @property {string} [token]
 * @property {boolean} [isGuest]
 */

/**
 * @typedef {Object} AuthContextType
 * @property {UserProfile|null} user
 * @property {string|null} token
 * @property {(data: UserProfile) => void} login
 * @property {() => void} loginAsGuest
 * @property {() => void} logout
 * @property {(newData: Partial<UserProfile>) => void} updateUser
 */

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const syncUser = async (authToken) => {
      try {
        const { data } = await API.get("auth/me");
        updateUser({ ...data, token: authToken });
      } catch (err) {
        console.error("Failed to sync user data:", err);
      }
    };

    try {
      const stored = JSON.parse(
        localStorage.getItem("user") || "null"
      );
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

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setToken(data.token || null);
  };

  const loginAsGuest = () => {
    const guestData = { name: "Guest", isGuest: true };
    localStorage.setItem("user", JSON.stringify(guestData));
    setUser(guestData);
    setToken(null);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const updateUser = (newData) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...newData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, loginAsGuest, logout, updateUser }}
    >
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
