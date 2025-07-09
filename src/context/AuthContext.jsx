import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on app mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("🔄 Fetching profile...");
        const response = await api.get("/auth/profile");
        console.log("✅ Profile fetched:", response.data);
        setUser(response.data);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err.message);
        console.log("🔎 Cookies?", document.cookie); // This won’t show HttpOnly cookie but may help
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  

  const login = async (username, password) => {
    try {
      console.log("🔐 Attempting login for:", username);
      await api.post("/auth/login", { identifier: username, password }); // ✅ FIXED
      console.log("✅ Login successful. Fetching profile...");
      const response = await api.get("/auth/profile");
      console.log("✅ Profile after login:", response.data);
      setUser(response.data);
    } catch (err) {
      console.error("❌ Login failed:", err.message);
      setUser(null);
      throw new Error("Login failed. Please check your credentials.");
    }
  };
  

  const logout = async () => {
    try {
      console.log("🚪 Logging out...");
      await api.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("roomId");
      localStorage.removeItem("username");
      console.log("✅ Logout successful");
    } catch (err) {
      console.error("❌ Logout failed:", err.message);
      throw new Error("Logout failed. Please try again.");
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log("📝 Attempting registration:", { username, email });
      await api.post("/auth/register", { username, email, password });
      console.log("✅ Registration successful. Logging in...");
      await login(username, password);
    } catch (err) {
      console.error("❌ Registration failed:", err.message);
      throw new Error("Registration failed. Try different credentials.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
