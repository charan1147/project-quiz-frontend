import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/getme");
        setUser(res.data);
      } catch (err) {
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post("/auth/login", { identifier, password });
    const token = res.data.token;
    localStorage.setItem("token", token);

    const profile = await api.get("/auth/getme"); 
    setUser(profile.data);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roomId");
    localStorage.removeItem("username");
    setUser(null);
  };

  const register = async (username, email, password) => {
    await api.post("/auth/register", { username, email, password });
    await login(username, password);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
